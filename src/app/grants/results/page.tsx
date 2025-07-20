import Link from 'next/link';
import { createClient } from '../../../../utils/supabase/server';
import type { Grant } from '../../../../lib/types';

type PageProps = { searchParams: Promise<{ [key: string]: string | undefined }> };

// Define a proper type for the tag structure
type GrantTag = {
  id: number;
  name: string;
  type: string;
};

const parseIds = (param: string | undefined) => param?.split(',').map(Number).filter(Boolean) || [];

export default async function GrantsResultsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const supabase = await createClient();
    const selectedStageIds = parseIds(params.stage);
    const selectedIndustryIds = parseIds(params.industry);
    const selectedDocumentsRequiredIds = parseIds(params.documents_required);
    const selectedPreferencesIds = parseIds(params.preferences);

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
        if (selectedPreferencesIds.some(id => grantTagIds.includes(id))) matchScore += 10;
        
        // Check hard requirements (prerequisites)
        const userHasRequirement = (name: string) => selectedDocumentsRequiredIds.some(id => requirementMap.get(id) === name);
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
        <div className="bg-black min-h-screen text-white p-4">
            <div className="container mx-auto max-w-7xl">
                {/* Header Navigation */}
                <div className="flex justify-between items-center mb-8">
                    <Link href="/grants" className="text-green-400 hover:text-green-300 transition-colors">
                        &larr; Back to Questionnaire
                    </Link>
                    <Link href="/" className="text-white hover:text-gray-300 transition-colors">
                        Home
                    </Link>
                </div>

                {/* Main Title */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Your Recommended Grants</h1>
                    <p className="text-gray-400 text-lg">
                        Found {sortedGrants.length} grants matching your criteria
                    </p>
                </div>

                {/* Search Criteria Section */}
                <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-800">
                    <h2 className="text-white font-semibold mb-3">Your Search Criteria:</h2>
                    <div className="flex flex-wrap gap-2">
                        {selectedStageIds.length > 0 && (
                            <span className="text-green-400">Stage Match: Selected</span>
                        )}
                        {selectedIndustryIds.length > 0 && (
                            <span className="text-green-400">Industry Match: Selected</span>
                        )}
                        {selectedDocumentsRequiredIds.length > 0 && (
                            <span className="text-green-400">Prerequisites: Selected</span>
                        )}
                        {selectedPreferencesIds.length > 0 && (
                            <span className="text-green-400">Impact Area: Selected</span>
                        )}
                    </div>
                </div>

                {sortedGrants.length === 0 ? (
                    <div className="text-center bg-gray-900 p-12 rounded-lg border border-gray-800">
                        <h2 className="text-3xl font-bold text-white mb-4">No grants found</h2>
                        <p className="text-gray-400 text-lg mb-8">Try adjusting your selections for a broader search.</p>
                        <Link href="/grants" className="inline-block px-8 py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition-colors">
                            Start Over
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedGrants.map(grant => {
                            // @ts-expect-error - Safely handling complex Supabase join types
                            const grantTags = grant.grant_tags.map(gt => gt.tags) as GrantTag[];
                            const stageTags = grantTags.filter((tag: GrantTag) => tag.type === 'STAGE');
                            const industryTags = grantTags.filter((tag: GrantTag) => tag.type === 'INDUSTRY');
                            const socialImpactTags = grantTags.filter((tag: GrantTag) => tag.type === 'SOCIAL_IMPACT');
                            
                            return (
                                <div key={grant.id} className={`bg-gray-800 rounded-lg p-6 border ${grant.isEligible ? 'border-gray-700 hover:border-gray-600' : 'border-red-500/50'} transition-colors`}>
                                    {/* Top Section */}
                                    <div className="mb-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <h2 className="text-xl font-bold text-white">{grant.name}</h2>
                                            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${grant.isEligible ? 'bg-purple-500 text-white' : 'bg-red-500 text-white'}`}>
                                                Score: {grant.matchScore}
                                            </div>
                                        </div>
                                        
                                        <p className="text-green-400 text-sm font-medium mb-2">
                                            {grant.organization}
                                        </p>

                                        {!grant.isEligible && (
                                            <p className="text-sm text-red-400 bg-red-500/10 p-2 rounded-md mb-2">
                                                ⚠️ Eligibility requirements may not be met
                                            </p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
                                        {grant.details}
                                    </p>

                                    {/* Grant Amount */}
                                    {grant.amount_max && (
                                        <div className="mb-4">
                                            <h3 className="text-white font-semibold text-sm mb-2">Grant Amount:</h3>
                                            <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm border border-green-500/30">
                                                {grant.amount_max}
                                            </span>
                                        </div>
                                    )}

                                    {/* Stages */}
                                    {stageTags.length > 0 && (
                                        <div className="mb-4">
                                            <h3 className="text-white font-semibold text-sm mb-2">Stages:</h3>
                                            <div className="flex flex-wrap gap-1">
                                                {stageTags.slice(0, 3).map((tag: GrantTag) => (
                                                    <span key={tag.id} className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                                                        {tag.name}
                                                    </span>
                                                ))}
                                                {stageTags.length > 3 && (
                                                    <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                                                        +{stageTags.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Industries */}
                                    {industryTags.length > 0 && (
                                        <div className="mb-4">
                                            <h3 className="text-white font-semibold text-sm mb-2">Industries:</h3>
                                            <div className="flex flex-wrap gap-1">
                                                {industryTags.slice(0, 3).map((tag: GrantTag) => (
                                                    <span key={tag.id} className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                                                        {tag.name}
                                                    </span>
                                                ))}
                                                {industryTags.length > 3 && (
                                                    <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                                                        +{industryTags.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Impact Areas */}
                                    {socialImpactTags.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-white font-semibold text-sm mb-2">Impact Areas:</h3>
                                            <div className="flex flex-wrap gap-1">
                                                {socialImpactTags.map((tag: GrantTag) => (
                                                    <span key={tag.id} className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                                                        {tag.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="space-y-2">
                                        <a 
                                            href={grant.application_link || '#'} 
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full bg-green-500 text-white text-center py-2 px-4 rounded-lg font-semibold hover:bg-green-400 transition-colors"
                                        >
                                            Apply Now
                                        </a>
                                        <button className="block w-full bg-blue-500 text-white text-center py-2 px-4 rounded-lg font-semibold hover:bg-blue-400 transition-colors">
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
} 