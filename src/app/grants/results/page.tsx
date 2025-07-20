import Link from 'next/link';
import { createClient } from '../../../../utils/supabase/server';
import type { Grant } from '../../../../lib/types';

type PageProps = { searchParams: Promise<{ [key: string]: string | undefined }> };

const parseIds = (param: string | undefined) => param?.split(',').map(Number).filter(Boolean) || [];

export default async function GrantsResultsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const supabase = await createClient();
    const selectedStageIds = parseIds(params.stage);
    const selectedIndustryIds = parseIds(params.industry);
    const selectedRequirementIds = parseIds(params.requirement);
    const selectedLocationIds = parseIds(params.location);
    const selectedSocialImpactIds = parseIds(params.social_impact);
    const selectedSpecialCategoryIds = parseIds(params.special_category);

    const { data: grantsData, error: grantsError } = await supabase.from('grants').select('*, grant_tags(tags(id, name, type))');
    const { data: allTagsData, error: tagsError } = await supabase.from('tags').select('id, name');

    if (grantsError || tagsError) {
        return <p className="text-white text-center p-8">Could not load grant data. Please try again.</p>;
    }

    const grants: Grant[] = grantsData || [];
    const requirementMap = new Map((allTagsData || []).map(tag => [tag.id, tag.name]));

    const scoredGrants = grants.map(grant => {
        let matchScore = 0;
        let isEligible = true;

        // Positive scoring for tag matches
        // @ts-expect-error - Handling complex Supabase join types safely
        const grantTagIds = grant.grant_tags.map(gt => gt.tags.id);
        if (selectedStageIds.some(id => grantTagIds.includes(id))) matchScore += 25;
        if (selectedIndustryIds.some(id => grantTagIds.includes(id))) matchScore += 25;
        if (selectedLocationIds.some(id => grantTagIds.includes(id))) matchScore += 10;
        if (selectedSocialImpactIds.some(id => grantTagIds.includes(id))) matchScore += 10;
        
        // Check for special categories
        if (grant.women_led_focus && selectedSpecialCategoryIds.some(id => requirementMap.get(id) === 'Women-Led Startup')) matchScore += 15;
        if (grant.student_focus && selectedSpecialCategoryIds.some(id => requirementMap.get(id) === 'Student Startup')) matchScore += 15;

        // Check hard requirements
        const userHasRequirement = (name: string) => selectedRequirementIds.some(id => requirementMap.get(id) === name);
        if (grant.dpiit_required && !userHasRequirement('DPIIT Registration')) isEligible = false;
        if (grant.patent_required && !userHasRequirement('Patent/IP')) isEligible = false;
        if (grant.prototype_required && !userHasRequirement('Working Prototype')) isEligible = false;
        if (grant.technical_cofounder_required && !userHasRequirement('Technical Co-founder')) isEligible = false;
        if (grant.full_time_commitment && !userHasRequirement('Full-time Commitment')) isEligible = false;

        // If not eligible, apply a heavy penalty to push it down the list
        if (!isEligible) {
            matchScore -= 100;
        }

        return { ...grant, matchScore, isEligible };
    });

    const sortedGrants = scoredGrants.sort((a, b) => b.matchScore - a.matchScore);

    return (
        <div className="bg-black min-h-screen text-white p-8">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-4xl font-bold text-center mb-4">Your Recommended Grants</h1>
                <p className="text-center text-gray-400 mb-12">Based on your selections, here are the best matches for you.</p>
        {sortedGrants.length === 0 ? (
                    <div className="text-center bg-gray-900 p-8 rounded-lg">
                        <h2 className="text-2xl font-bold">No grants found.</h2>
                        <p className="text-gray-400 mt-2">Try adjusting your selections for a broader search.</p>
                        <Link href="/grants" className="mt-6 inline-block px-6 py-2 bg-purple-600 rounded-lg font-semibold hover:bg-purple-700">Go Back</Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {sortedGrants.map(grant => (
                            <div key={grant.id} className={`bg-[#1C1C1E] rounded-lg p-6 border ${grant.isEligible ? 'border-gray-800' : 'border-red-500/50'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold text-purple-400">{grant.name}</h2>
                                        <p className="text-gray-400 mt-1">{grant.organization}</p>
                      </div>
                                    <div className={`font-bold px-3 py-1 rounded-full text-sm ${grant.isEligible ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>Score: {grant.matchScore}</div>
                      </div>
                                {!grant.isEligible && (
                                    <p className="mt-3 text-sm text-red-400 bg-red-500/10 p-2 rounded-md">
                                        This grant has specific eligibility requirements you may not meet.
                                    </p>
                                )}
                                <p className="mt-4 text-gray-300">{grant.details}</p>
                                <div className="mt-6 text-right">
                                    <a href={grant.application_link || '#'} target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">Apply Now</a>
                      </div>
                    </div>
                        ))}
                    </div>
                  )}
            </div>
          </div>
    );
} 