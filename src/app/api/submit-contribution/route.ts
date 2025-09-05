import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submission_type, submission_data } = body;

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
    let validationErrors: string[] = [];

    if (submission_type === 'grant') {
      if (!submission_data.name) validationErrors.push('Grant name is required');
      if (!submission_data.organization) validationErrors.push('Organization is required');
      if (!submission_data.details) validationErrors.push('Grant details are required');
    } else if (submission_type === 'vc') {
      if (!submission_data.name) validationErrors.push('VC firm name is required');
    } else if (submission_type === 'mentor') {
      if (!submission_data.name) validationErrors.push('Mentor name is required');
      if (!submission_data.about) validationErrors.push('About section is required');
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
      return NextResponse.json({ 
        error: 'Failed to submit contribution', 
        details: error.message 
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
