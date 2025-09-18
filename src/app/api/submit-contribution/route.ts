import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client inside the function to avoid build-time initialization
    // Temporarily using anon key to test if service role key is the issue
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    console.log('API Route: Environment variables check');
    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing');
    console.log('SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing');

    const body = await request.json();
    const { submission_type, submission_data } = body;

    console.log('API Route: Received request');
    console.log('Submission type:', submission_type);
    console.log('Submission data:', JSON.stringify(submission_data, null, 2));

    // Validate required fields
    if (!submission_type || !submission_data) {
      return NextResponse.json({ 
        error: 'Missing required fields: submission_type and submission_data' 
      }, { status: 400 });
    }

    // Validate submission type
    const validTypes = ['grant', 'vc', 'mentor', 'incubation_centre', 'post'];
    if (!validTypes.includes(submission_type)) {
      return NextResponse.json({ 
        error: `Invalid submission_type. Must be one of: ${validTypes.join(', ')}` 
      }, { status: 400 });
    }

    // Validate submission data based on type
    const validationErrors: string[] = [];

    if (submission_type === 'grant') {
      if (!submission_data.name) validationErrors.push('Grant name is required');
      if (!submission_data.organization) validationErrors.push('Organization is required');
      if (!submission_data.details) validationErrors.push('Grant details are required');
      if (!submission_data.industry) validationErrors.push('Industry sector is required');
      if (!submission_data.stage) validationErrors.push('Startup stage is required');
    } else if (submission_type === 'vc') {
      if (!submission_data.name) validationErrors.push('VC firm name is required');
    } else if (submission_type === 'mentor') {
      if (!submission_data.name) validationErrors.push('Mentor name is required');
      if (!submission_data.about) validationErrors.push('About section is required');
      
      // Validate new structure (sector + functional_expertise) or old structure (superpower)
      const hasNewStructure = submission_data.sector || submission_data.functional_expertise;
      const hasOldStructure = submission_data.superpower && submission_data.superpower !== '';
      
      if (!hasNewStructure && !hasOldStructure) {
        validationErrors.push('Expertise information is required - please select both sector and functional expertise');
      }
      
      // If using new structure, validate both fields are provided
      if (hasNewStructure && (!submission_data.sector || !submission_data.functional_expertise)) {
        validationErrors.push('Both industry sector and functional expertise must be selected');
      }
      
      // Validate rate tier is provided
      if (!submission_data.rate_tier || submission_data.rate_tier === '') {
        validationErrors.push('Rate tier must be selected');
      }
    } else if (submission_type === 'incubation_centre') {
      if (!submission_data.name) validationErrors.push('Incubation centre name is required');
    } else if (submission_type === 'post') {
      if (!submission_data.title) validationErrors.push('Post title is required');
      if (!submission_data.content) validationErrors.push('Post content is required');
    }

    if (validationErrors.length > 0) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationErrors 
      }, { status: 400 });
    }

    // Insert into community_submissions table
    const { data, error } = await supabaseAdmin
      .from('community_submissions')
      .insert([{
        submission_type,
        submission_data,
        status: 'pending_review'
      }])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json({ 
        error: 'Failed to submit contribution', 
        details: error.message,
        errorCode: error.code,
        errorHint: error.hint
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Contribution submitted successfully! It will be reviewed by our team.',
      submission_id: data.id
    });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
