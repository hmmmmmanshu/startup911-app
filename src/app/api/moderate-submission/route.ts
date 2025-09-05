import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

interface ModerateRequest {
  submission_id: string;
  action: 'approve' | 'reject';
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify JWT token and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Check if user is admin
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile || userProfile.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    // Parse request body
    let requestData: ModerateRequest;
    try {
      requestData = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    // Validate request data
    if (!requestData.submission_id || !requestData.action) {
      return NextResponse.json({ error: 'submission_id and action are required' }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(requestData.action)) {
      return NextResponse.json({ error: 'action must be either "approve" or "reject"' }, { status: 400 });
    }

    // Get the submission
    const { data: submission, error: submissionError } = await supabase
      .from('community_submissions')
      .select('*')
      .eq('id', requestData.submission_id)
      .single();

    if (submissionError || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Check if submission is in pending status
    if (submission.status !== 'pending_review') {
      return NextResponse.json({ error: 'Submission is not in pending review status' }, { status: 400 });
    }

    if (requestData.action === 'approve') {
      // Handle approval
      const submissionData = submission.submission_data as Record<string, unknown>;
      const submissionType = submission.submission_type as 'grant' | 'vc' | 'mentor' | 'incubation_centre' | 'post';

      let insertResult;
      
      try {
        if (submissionType === 'grant') {
          // Insert into grants table
          const grantData = {
            name: submissionData.name,
            organization: submissionData.organization,
            details: submissionData.details,
            status: submissionData.status || 'Active',
            amount_max: submissionData.amount_max,
            application_deadline: submissionData.application_deadline,
            application_link: submissionData.application_link,
            dpiit_required: submissionData.dpiit_required || false,
            tech_focus_required: submissionData.tech_focus_required || false,
            patent_required: submissionData.patent_required || false,
            prototype_required: submissionData.prototype_required || false,
            technical_cofounder_required: submissionData.technical_cofounder_required || false,
            full_time_commitment: submissionData.full_time_commitment || false,
            women_led_focus: submissionData.women_led_focus || false,
            student_focus: submissionData.student_focus || false,
            mentorship_included: submissionData.mentorship_included || false,
            workspace_provided: submissionData.workspace_provided || false,
            network_access: submissionData.network_access || false,
          };

          insertResult = await supabase
            .from('grants')
            .insert([grantData])
            .select()
            .single();

          // Handle tag mapping for Grant
          if (insertResult.data && !insertResult.error) {
            const grantId = insertResult.data.id;
            const tagMappings = [];

            // Map requirements to requirement tags
            const requirementMappings = [
              { field: 'dpiit_required', tagName: 'DPIIT Registration' },
              { field: 'patent_required', tagName: 'Patent/IP' },
              { field: 'prototype_required', tagName: 'Working Prototype' },
              { field: 'technical_cofounder_required', tagName: 'Technical Co-founder' },
              { field: 'full_time_commitment', tagName: 'Full-time Commitment' }
            ];

            for (const mapping of requirementMappings) {
              if (submissionData[mapping.field]) {
                const { data: requirementTag } = await supabase
                  .from('tags')
                  .select('id')
                  .eq('name', mapping.tagName)
                  .eq('type', 'REQUIREMENT')
                  .single();
                
                if (requirementTag) {
                  tagMappings.push({ grant_id: grantId, tag_id: requirementTag.id });
                }
              }
            }

            // Map special categories
            const specialCategoryMappings = [
              { field: 'women_led_focus', tagName: 'Women-Led Startup' },
              { field: 'student_focus', tagName: 'Student Startup' }
            ];

            for (const mapping of specialCategoryMappings) {
              if (submissionData[mapping.field]) {
                const { data: specialTag } = await supabase
                  .from('tags')
                  .select('id')
                  .eq('name', mapping.tagName)
                  .eq('type', 'SPECIAL_CATEGORY')
                  .single();
                
                if (specialTag) {
                  tagMappings.push({ grant_id: grantId, tag_id: specialTag.id });
                }
              }
            }

            // Insert tag mappings
            if (tagMappings.length > 0) {
              await supabase
                .from('grant_tags')
                .insert(tagMappings);
            }
          }

        } else if (submissionType === 'vc') {
          // Insert into vcs table
          const vcData = {
            name: submissionData.name,
            website: submissionData.website,
            linkedin: submissionData.linkedin,
            country_based_of: submissionData.country_based_of,
            about: submissionData.about,
            key_person: submissionData.key_person,
          };

          insertResult = await supabase
            .from('vcs')
            .insert([vcData])
            .select()
            .single();

          // Handle tag mapping for VC
          if (insertResult.data && !insertResult.error) {
            const vcId = insertResult.data.id;
            const tagMappings = [];

            // Map sector to industry tag
            if (submissionData.sector) {
              const { data: industryTag } = await supabase
                .from('tags')
                .select('id')
                .eq('name', submissionData.sector)
                .eq('type', 'INDUSTRY')
                .single();
              
              if (industryTag) {
                tagMappings.push({ vc_id: vcId, tag_id: industryTag.id });
              }
            }

            // Map stage_focus to stage tag
            if (submissionData.stage_focus) {
              const { data: stageTag } = await supabase
                .from('tags')
                .select('id')
                .eq('name', submissionData.stage_focus)
                .eq('type', 'STAGE')
                .single();
              
              if (stageTag) {
                tagMappings.push({ vc_id: vcId, tag_id: stageTag.id });
              }
            }

            // Map region_focus to region tag
            if (submissionData.region_focus) {
              const { data: regionTag } = await supabase
                .from('tags')
                .select('id')
                .eq('name', submissionData.region_focus)
                .eq('type', 'REGION')
                .single();
              
              if (regionTag) {
                tagMappings.push({ vc_id: vcId, tag_id: regionTag.id });
              }
            }

            // Insert tag mappings
            if (tagMappings.length > 0) {
              await supabase
                .from('vc_tags')
                .insert(tagMappings);
            }
          }

        } else if (submissionType === 'mentor') {
          // Insert into mentors table
          const mentorData = {
            name: submissionData.name,
            photo_url: submissionData.photo_url,
            superpower: submissionData.superpower,
            about: submissionData.about,
            rate_tier: submissionData.rate_tier,
            languages: submissionData.languages || [],
            linkedin_url: submissionData.linkedin_url,
            calendly_url: submissionData.calendly_url,
          };

          insertResult = await supabase
            .from('mentors')
            .insert([mentorData])
            .select()
            .single();

          // Handle tag mapping for Mentor
          if (insertResult.data && !insertResult.error) {
            const mentorId = insertResult.data.id;
            const tagMappings = [];

            // Map superpower to industry tag (if it matches known industries)
            if (submissionData.superpower) {
              const superpower = submissionData.superpower as string;
              
              // Try to match superpower to industry tags
              const { data: industryTags } = await supabase
                .from('tags')
                .select('id, name')
                .eq('type', 'INDUSTRY');
              
              if (industryTags) {
                for (const tag of industryTags) {
                  if (superpower.toLowerCase().includes(tag.name.toLowerCase()) || 
                      tag.name.toLowerCase().includes(superpower.toLowerCase())) {
                    tagMappings.push({ mentor_id: mentorId, tag_id: tag.id });
                    break; // Only match the first industry found
                  }
                }
              }
            }

            // Insert tag mappings
            if (tagMappings.length > 0) {
              await supabase
                .from('mentor_tags')
                .insert(tagMappings);
            }
          }

        } else {
          return NextResponse.json({ error: `Unsupported submission type: ${submissionType}` }, { status: 400 });
        }

        if (insertResult.error) {
          console.error('Insert error:', insertResult.error);
          return NextResponse.json({ 
            error: 'Failed to insert data into live table', 
            details: insertResult.error.message 
          }, { status: 500 });
        }

      } catch (insertError) {
        console.error('Insert error:', insertError);
        return NextResponse.json({ 
          error: 'Failed to insert data into live table', 
          details: insertError instanceof Error ? insertError.message : 'Unknown error'
        }, { status: 500 });
      }
    }

    // Update submission status
    const newStatus = requestData.action === 'approve' ? 'approved' : 'rejected';
    const updateData: Record<string, unknown> = {
      status: newStatus,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    };

    if (requestData.notes) {
      updateData.notes = requestData.notes;
    }

    const { error: updateError } = await supabase
      .from('community_submissions')
      .update(updateData)
      .eq('id', requestData.submission_id);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ 
        error: 'Failed to update submission status', 
        details: updateError.message 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Submission ${requestData.action}d successfully`,
      action: requestData.action,
      submission_id: requestData.submission_id
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'An unexpected error occurred. Please try again.' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Moderation API is working' }, { status: 200 });
}
