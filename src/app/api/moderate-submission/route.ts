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
            amount_min: submissionData.amount_min,
            amount_max: submissionData.amount_max,
            amount_currency: submissionData.amount_currency || 'INR',
            application_deadline: submissionData.application_deadline,
            application_link: submissionData.application_link,
            geographical_focus: submissionData.geographical_focus || [],
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

            // Map industry sectors (multi-select)
            if (submissionData.industry_sectors && Array.isArray(submissionData.industry_sectors)) {
              for (const industry of submissionData.industry_sectors) {
                const { data: industryTag } = await supabase
                  .from('tags')
                  .select('id')
                  .eq('name', industry)
                  .eq('type', 'INDUSTRY')
                  .single();
                
                if (industryTag) {
                  tagMappings.push({ grant_id: grantId, tag_id: industryTag.id });
                }
              }
            }

            // Map startup stages (multi-select)
            if (submissionData.startup_stages && Array.isArray(submissionData.startup_stages)) {
              for (const stage of submissionData.startup_stages) {
                const { data: stageTag } = await supabase
                  .from('tags')
                  .select('id')
                  .eq('name', stage)
                  .eq('type', 'STAGE')
                  .single();
                
                if (stageTag) {
                  tagMappings.push({ grant_id: grantId, tag_id: stageTag.id });
                }
              }
            }

            // Map geographical focus (multi-select)
            if (submissionData.geographical_focus && Array.isArray(submissionData.geographical_focus)) {
              for (const region of submissionData.geographical_focus) {
                const { data: regionTag } = await supabase
                  .from('tags')
                  .select('id')
                  .eq('name', region)
                  .eq('type', 'REGION')
                  .single();
                
                if (regionTag) {
                  tagMappings.push({ grant_id: grantId, tag_id: regionTag.id });
                }
              }
            }

            // Map currency
            if (submissionData.amount_currency) {
              const { data: currencyTag } = await supabase
                .from('tags')
                .select('id')
                .eq('name', submissionData.amount_currency)
                .eq('type', 'CURRENCY')
                .single();
              
              if (currencyTag) {
                tagMappings.push({ grant_id: grantId, tag_id: currencyTag.id });
              }
            }

            // Map ALL requirements to requirement tags (expanded list)
            const requirementMappings = [
              { field: 'dpiit_required', tagName: 'DPIIT Registration' },
              { field: 'tech_focus_required', tagName: 'Tech Focus Required' },
              { field: 'patent_required', tagName: 'Patent/IP' },
              { field: 'prototype_required', tagName: 'Working Prototype' },
              { field: 'technical_cofounder_required', tagName: 'Technical Co-founder' },
              { field: 'full_time_commitment', tagName: 'Full-time Commitment' },
              { field: 'mentorship_included', tagName: 'Mentorship Included' },
              { field: 'workspace_provided', tagName: 'Workspace Provided' },
              { field: 'network_access', tagName: 'Network Access' }
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
            sector: Array.isArray(submissionData.sectors) ? submissionData.sectors.join(', ') : submissionData.sector,
            stage_focus: Array.isArray(submissionData.stage_focus) ? submissionData.stage_focus.join(', ') : submissionData.stage_focus,
            region_focus: Array.isArray(submissionData.region_focus) ? submissionData.region_focus.join(', ') : submissionData.region_focus,
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

            // Map sectors to industry tags (multi-select)
            const sectorsArray = Array.isArray(submissionData.sectors) ? submissionData.sectors : 
                                submissionData.sector ? [submissionData.sector] : [];
            
            for (const sector of sectorsArray) {
              const { data: industryTag } = await supabase
                .from('tags')
                .select('id')
                .eq('name', sector)
                .eq('type', 'INDUSTRY')
                .single();
              
              if (industryTag) {
                tagMappings.push({ vc_id: vcId, tag_id: industryTag.id });
              }
            }

            // Map stage_focus to stage tags (multi-select)
            const stagesArray = Array.isArray(submissionData.stage_focus) ? submissionData.stage_focus : 
                               submissionData.stage_focus ? [submissionData.stage_focus] : [];
            
            for (const stage of stagesArray) {
              const { data: stageTag } = await supabase
                .from('tags')
                .select('id')
                .eq('name', stage)
                .eq('type', 'STAGE')
                .single();
              
              if (stageTag) {
                tagMappings.push({ vc_id: vcId, tag_id: stageTag.id });
              }
            }

            // Map region_focus to region tags (multi-select)
            const regionsArray = Array.isArray(submissionData.region_focus) ? submissionData.region_focus : 
                                 submissionData.region_focus ? [submissionData.region_focus] : [];
            
            for (const region of regionsArray) {
              const { data: regionTag } = await supabase
                .from('tags')
                .select('id')
                .eq('name', region)
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
          // Handle both old structure (superpower) and new structure (sectors + functional_expertise)
          let superpowerValue = '';
          
          // Handle new multi-select structure
          if (submissionData.sectors || submissionData.functional_expertise) {
            const sectorsArray = Array.isArray(submissionData.sectors) ? submissionData.sectors : 
                                submissionData.sector ? [submissionData.sector] : [];
            const expertiseArray = Array.isArray(submissionData.functional_expertise) ? submissionData.functional_expertise : 
                                  submissionData.functional_expertise ? [submissionData.functional_expertise] : [];
            
            const sectorsStr = sectorsArray.join(', ');
            const expertiseStr = expertiseArray.join(', ');
            superpowerValue = `${sectorsStr}${sectorsStr && expertiseStr ? ' | ' : ''}${expertiseStr}`.trim();
          } else if (submissionData.superpower) {
            // Old structure
            superpowerValue = submissionData.superpower as string;
          }
          
          const mentorData = {
            name: submissionData.name,
            photo_url: submissionData.photo_url,
            superpower: superpowerValue,
            sector: Array.isArray(submissionData.sectors) ? submissionData.sectors.join(', ') : submissionData.sector,
            functional_expertise: Array.isArray(submissionData.functional_expertise) ? submissionData.functional_expertise.join(', ') : submissionData.functional_expertise,
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

            // Map sectors and functional expertise to tags (multi-select)
            // Handle both old and new submission structures
            const sectorsArray = Array.isArray(submissionData.sectors) ? submissionData.sectors : 
                                submissionData.sector ? [submissionData.sector] : [];
            const expertiseArray = Array.isArray(submissionData.functional_expertise) ? submissionData.functional_expertise : 
                                  submissionData.functional_expertise ? [submissionData.functional_expertise] : [];
            const oldSuperpower = submissionData.superpower as string;
            
            // Direct mapping for exact matches with industry tags
            const industryMappings: Record<string, string> = {
              'Technology & Software': 'Technology & Software',
              'Finance & Fintech': 'Finance & Fintech',
              'Healthcare & Biotech': 'Healthcare & Biotech',
              'E-commerce & Retail': 'E-commerce & Retail',
              'Education & EdTech': 'Education & EdTech',
              'Energy & Sustainability': 'Energy & Sustainability',
              'Agriculture & Food': 'Agriculture & Food',
              'Manufacturing': 'Manufacturing',
              'Media & Entertainment': 'Media & Entertainment',
              'Real Estate & PropTech': 'Real Estate & PropTech',
              'Transportation & Logistics': 'Transportation & Logistics',
              'Gaming & Sports': 'Gaming & Sports',
              'Travel & Tourism': 'Travel & Tourism',
              'Social Impact': 'Social Impact',
              'DeepTech & AI': 'DeepTech & AI',
              'Blockchain & Web3': 'Blockchain & Web3'
            };

            // Direct mapping for functional expertise
            const expertiseMappings: Record<string, string> = {
              'Product Strategy': 'Product Strategy',
              'Marketing & Growth': 'Marketing & Growth',
              'Operations & Scaling': 'Operations & Scaling',
              'Fundraising & Investment': 'Fundraising & Investment',
              'Legal & Compliance': 'Legal & Compliance',
              'Sales & Business Development': 'Sales & Business Development',
              'Human Resources & Talent': 'Human Resources & Talent',
              'Technology & Engineering': 'Technology & Engineering',
              'Data & Analytics': 'Data & Analytics',
              'Design & UX': 'Design & UX',
              'Finance & Accounting': 'Finance & Accounting',
              'Strategy & Planning': 'Strategy & Planning',
              'International Expansion': 'International Expansion',
              'Partnerships & Alliances': 'Partnerships & Alliances'
            };

            // Handle new structure (multi-select sectors + functional_expertise)
            if (sectorsArray.length > 0 || expertiseArray.length > 0) {
              // Map industry sectors (multi-select)
              for (const sector of sectorsArray) {
                if (industryMappings[sector]) {
                  const { data: industryTag } = await supabase
                    .from('tags')
                    .select('id')
                    .eq('name', industryMappings[sector])
                    .eq('type', 'INDUSTRY')
                    .single();
                  
                  if (industryTag) {
                    tagMappings.push({ mentor_id: mentorId, tag_id: industryTag.id });
                  }
                }
              }

              // Map functional expertise (multi-select)
              for (const expertise of expertiseArray) {
                if (expertiseMappings[expertise]) {
                  const { data: expertiseTag } = await supabase
                    .from('tags')
                    .select('id')
                    .eq('name', expertiseMappings[expertise])
                    .eq('type', 'EXPERTISE')
                    .single();
                  
                  if (expertiseTag) {
                    tagMappings.push({ mentor_id: mentorId, tag_id: expertiseTag.id });
                  }
                }
              }
            } 
            // Handle old structure (superpower field)
            else if (oldSuperpower) {
              // Try to match against industry tags first
              for (const [key, value] of Object.entries(industryMappings)) {
                if (oldSuperpower.toLowerCase().includes(key.toLowerCase()) || 
                    key.toLowerCase().includes(oldSuperpower.toLowerCase())) {
                  const { data: industryTag } = await supabase
                    .from('tags')
                    .select('id')
                    .eq('name', value)
                    .eq('type', 'INDUSTRY')
                    .single();
                  
                  if (industryTag) {
                    tagMappings.push({ mentor_id: mentorId, tag_id: industryTag.id });
                    break;
                  }
                }
              }
              
              // Try to match against expertise tags
              for (const [key, value] of Object.entries(expertiseMappings)) {
                if (oldSuperpower.toLowerCase().includes(key.toLowerCase()) || 
                    key.toLowerCase().includes(oldSuperpower.toLowerCase())) {
                  const { data: expertiseTag } = await supabase
                    .from('tags')
                    .select('id')
                    .eq('name', value)
                    .eq('type', 'EXPERTISE')
                    .single();
                  
                  if (expertiseTag) {
                    tagMappings.push({ mentor_id: mentorId, tag_id: expertiseTag.id });
                    break;
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
