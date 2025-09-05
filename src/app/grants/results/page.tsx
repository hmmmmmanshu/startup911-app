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
    const searchType = params.search_type || 'simple';

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
        let hasAnyMatch = false;

        // Positive scoring for tag matches (same for both search types)
        // @ts-expect-error - Handling complex Supabase join types safely
        const grantTagIds = grant.grant_tags.map(gt => gt.tags.id);
        
        // Check for matches and only add to score if there are actual matches
        if (selectedStageIds.some(id => grantTagIds.includes(id))) {
            matchScore += 25;
            hasAnyMatch = true;
        }
        if (selectedIndustryIds.some(id => grantTagIds.includes(id))) {
            matchScore += 25;
            hasAnyMatch = true;
        }
        if (selectedPreferencesIds.some(id => grantTagIds.includes(id))) {
            matchScore += 10;
            hasAnyMatch = true;
        }
        
        // Add recency bias - newer grants get a small boost (only if they have matches)
        if (hasAnyMatch) {
            const daysSinceCreated = Math.floor((Date.now() - new Date(grant.created_at).getTime()) / (1000 * 60 * 60 * 24));
            if (daysSinceCreated <= 30) matchScore += 5; // Recent grants (last 30 days) get +5 points
            else if (daysSinceCreated <= 90) matchScore += 2; // Semi-recent grants (last 90 days) get +2 points
        }
        
        // Handle eligibility based on search type
        if (searchType === 'advanced') {
            // Advanced search: Apply strict eligibility requirements
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
        } else {
            // Simple search: Ignore hard eligibility filters, just show all grants
            isEligible = true;
        }

        return { ...grant, matchScore, isEligible, hasAnyMatch };
    });

    // Filter out grants with no matches and sort by score
    const sortedGrants = scoredGrants
        .filter(grant => grant.hasAnyMatch) // Only show grants that have at least one match
        .sort((a, b) => b.matchScore - a.matchScore);

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
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            searchType === 'simple' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-purple-500 text-white'
                        }`}>
                            {searchType === 'simple' ? 'Simple Search' : 'Advanced Search'}
                        </span>
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
                    <p className="text-sm text-gray-400">
                        {searchType === 'simple' 
                            ? 'Showing grants based on stage, industry, and preferences only. Eligibility requirements are not strictly enforced.'
                            : 'Showing grants with strict eligibility filtering. Grants that don\'t meet requirements are heavily penalized.'
                        }
                    </p>
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
                                <div key={grant.id} className={`group relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                                    searchType === 'simple' 
                                        ? 'border-gray-700/50 hover:border-green-500/30 hover:shadow-green-500/10' 
                                        : grant.isEligible 
                                            ? 'border-gray-700/50 hover:border-green-500/30 hover:shadow-green-500/10' 
                                            : 'border-red-500/30 hover:border-red-400/50'
                                }`}>
                                    {/* Score Badge */}
                                    <div className="absolute -top-3 -right-3">
                                        <div className="relative w-12 h-12">
                                            {/* Background Circle */}
                                            <div className="absolute inset-0 bg-gray-800 rounded-full border-2 border-gray-700"></div>
                                            
                                            {/* Score Circle */}
                                            <div className={`absolute inset-0 rounded-full flex items-center justify-center text-xs font-bold ${
                                                grant.matchScore >= 50 
                                                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30' 
                                                    : grant.matchScore >= 25
                                                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                                                        : 'bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/30'
                                            }`}>
                                                {grant.matchScore}
                                            </div>
                                            
                                            {/* Glow Effect */}
                                            <div className={`absolute inset-0 rounded-full opacity-20 blur-sm ${
                                                grant.matchScore >= 50 
                                                    ? 'bg-green-500' 
                                                    : grant.matchScore >= 25
                                                        ? 'bg-blue-500'
                                                        : 'bg-gray-500'
                                            }`}></div>
                                        </div>
                                    </div>

                                    {/* Header Section */}
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-green-400 transition-colors">
                                            {grant.name}
                                        </h2>
                                        
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            <p className="text-green-400 text-sm font-medium">
                                            {grant.organization}
                                            </p>
                                        </div>

                                        {searchType === 'advanced' && !grant.isEligible && (
                                            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-3">
                                                <div className="w-5 h-5 text-red-400">⚠️</div>
                                                <p className="text-sm text-red-400 font-medium">
                                                    Eligibility requirements may not be met
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="mb-6">
                                        <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                                        {grant.details}
                                    </p>
                                    </div>

                                    {/* Grant Amount */}
                                    {grant.amount_max && (
                                        <div className="mb-6">
                                            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center">
                                                        <span className="text-green-400 text-sm">💰</span>
                                                    </div>
                                                    <h3 className="text-white font-semibold text-sm">Grant Amount</h3>
                                                </div>
                                                <p className="text-green-300 text-sm font-medium">
                                                {grant.amount_max}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Tags Section */}
                                    <div className="space-y-4 mb-6">
                                    {/* Stages */}
                                    {stageTags.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-5 h-5 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                        <span className="text-blue-400 text-xs">🚀</span>
                                                    </div>
                                                    <h3 className="text-white font-semibold text-sm">Stages</h3>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                {stageTags.slice(0, 3).map((tag: GrantTag) => (
                                                        <span key={tag.id} className="bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-500/30">
                                                        {tag.name}
                                                    </span>
                                                ))}
                                                {stageTags.length > 3 && (
                                                        <span className="bg-gray-500/20 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-500/30">
                                                        +{stageTags.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Industries */}
                                    {industryTags.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-5 h-5 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                                        <span className="text-purple-400 text-xs">🏭</span>
                                                    </div>
                                                    <h3 className="text-white font-semibold text-sm">Industries</h3>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                {industryTags.slice(0, 3).map((tag: GrantTag) => (
                                                        <span key={tag.id} className="bg-purple-500/20 text-purple-300 px-3 py-1.5 rounded-lg text-xs font-medium border border-purple-500/30">
                                                        {tag.name}
                                                    </span>
                                                ))}
                                                {industryTags.length > 3 && (
                                                        <span className="bg-gray-500/20 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-500/30">
                                                        +{industryTags.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Impact Areas */}
                                    {socialImpactTags.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-5 h-5 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                                        <span className="text-emerald-400 text-xs">🌱</span>
                                                    </div>
                                                    <h3 className="text-white font-semibold text-sm">Impact Areas</h3>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                {socialImpactTags.map((tag: GrantTag) => (
                                                        <span key={tag.id} className="bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-medium border border-emerald-500/30">
                                                        {tag.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-3">
                                        <a 
                                            href={grant.application_link || '#'} 
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group/btn block w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-green-500/25 hover:scale-[1.02]"
                                        >
                                            <span className="flex items-center justify-center gap-2">
                                            Apply Now
                                                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </span>
                                        </a>
                                        <button className="group/btn block w-full bg-gray-700/50 text-gray-300 text-center py-3 px-4 rounded-xl font-semibold hover:bg-gray-600/50 hover:text-white transition-all duration-200 border border-gray-600/50 hover:border-gray-500/50">
                                            <span className="flex items-center justify-center gap-2">
                                            Learn More
                                                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </span>
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