// app/vcs/results/page.tsx

import Link from 'next/link';
import { createClient } from '../../../../utils/supabase/server';
import type { VC } from '../../../../lib/types'; // Import our defined VC type

type PageProps = { searchParams: Promise<{ [key: string]: string | undefined }> };

// Define a proper type for the tag structure
type VCTag = {
  id: number;
  name: string;
  type: string;
};

// Helper to safely parse numbers from the URL
const parseIds = (param: string | undefined) => param?.split(',').map(Number).filter(Boolean) || [];

// Main Page Component - Rewritten for type safety
export default async function VCsResultsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const supabase = await createClient();

  // --- 1. PARSE USER INPUT ---
      const selectedIndustryIds = parseIds(params.industry);
    const selectedStageIds = parseIds(params.stage);
    const selectedRegionIds = parseIds(params.region);

  // --- 2. FETCH DATA ---
  const { data: vcsData, error } = await supabase
    .from('vcs')
    .select('*, vc_tags(tags(id, name, type))');
  
  // Explicitly type the fetched data
  const vcs: VC[] = vcsData || [];

  if (error) {
    return <p className="text-white text-center p-8">Could not load VC data. Please try again.</p>;
  }

  // --- 3. ALGORITHM: SCORING & SORTING ---
  const scoredVCs = vcs.map(vc => {
    let matchScore = 0;
    let hasAnyMatch = false;
    
    // @ts-expect-error - Safely handling complex Supabase join types
    const vcTagIds = vc.vc_tags.map(vt => vt.tags.id);
    
    // Check for stage matches (higher weight)
    if (selectedStageIds.some(id => vcTagIds.includes(id))) {
      matchScore += 30;
      hasAnyMatch = true;
    }
    
    // Check for industry matches (medium weight)
    if (selectedIndustryIds.some(id => vcTagIds.includes(id))) {
      matchScore += 25;
      hasAnyMatch = true;
    }
    
    // Check for region matches (lower weight)
    if (selectedRegionIds.some(id => vcTagIds.includes(id))) {
      matchScore += 15;
      hasAnyMatch = true;
    }

    return { ...vc, matchScore, hasAnyMatch };
  });

  // Filter out VCs with no matches and sort by score
  const sortedVCs = scoredVCs
    .filter(vc => vc.hasAnyMatch) // Only show VCs that have at least one match
    .sort((a, b) => b.matchScore - a.matchScore);

  // --- 4. RENDER UI ---
  return (
    <div className="bg-black min-h-screen text-white p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/vcs" className="text-green-400 hover:text-green-300 transition-colors">
            &larr; Back to Questionnaire
          </Link>
          <Link href="/" className="text-white hover:text-gray-300 transition-colors">
            Home
          </Link>
        </div>

        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Your Recommended VCs</h1>
          <p className="text-gray-400 text-lg">
            Found {sortedVCs.length} VCs matching your criteria
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
            {selectedRegionIds.length > 0 && (
              <span className="text-green-400">Region Match: Selected</span>
            )}
          </div>
        </div>

        {sortedVCs.length === 0 ? (
          <div className="text-center bg-gray-900 p-12 rounded-lg border border-gray-800">
            <h2 className="text-3xl font-bold text-white mb-4">No VCs found</h2>
            <p className="text-gray-400 text-lg mb-8">Try adjusting your selections for a broader search.</p>
            <Link href="/vcs" className="inline-block px-8 py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition-colors">
              Start Over
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedVCs.map(vc => {
              // @ts-expect-error - Safely handling complex Supabase join types
              const vcTags = vc.vc_tags.map(vt => vt.tags) as VCTag[];
              const stageTags = vcTags.filter((tag: VCTag) => tag.type === null && ['Angel', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series C+', 'Pre-Series A'].includes(tag.name));
              const industryTags = vcTags.filter((tag: VCTag) => tag.type === null && !['Angel', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series C+', 'Pre-Series A'].includes(tag.name));
              const regionTags = vcTags.filter((tag: VCTag) => tag.type === 'REGION');
              
              return (
                <div key={vc.id} className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-green-500/30 hover:shadow-green-500/10">
                  {/* Score Badge */}
                  <div className="absolute -top-3 -right-3">
                    <div className="relative w-12 h-12">
                      {/* Background Circle */}
                      <div className="absolute inset-0 bg-gray-800 rounded-full border-2 border-gray-700"></div>
                      
                      {/* Score Circle */}
                      <div className={`absolute inset-0 rounded-full flex items-center justify-center text-xs font-bold ${
                        vc.matchScore >= 50 
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30' 
                          : vc.matchScore >= 25
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/30'
                      }`}>
                        {vc.matchScore}
                      </div>
                      
                      {/* Glow Effect */}
                      <div className={`absolute inset-0 rounded-full opacity-20 blur-sm ${
                        vc.matchScore >= 50 
                          ? 'bg-green-500' 
                          : vc.matchScore >= 25
                            ? 'bg-blue-500'
                            : 'bg-purple-500'
                      }`}></div>
                    </div>
                  </div>

                  {/* Header Section */}
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-green-400 transition-colors">
                      {vc.name}
                    </h2>
                    
                    {vc.country_based_of && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <p className="text-green-400 text-sm font-medium">
                          Based in {vc.country_based_of}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                      {vc.about}
                    </p>
                  </div>

                  {/* Tags Section */}
                  <div className="space-y-4 mb-6">
                    {/* Investment Stages */}
                    {stageTags.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-blue-400 text-xs">🚀</span>
                          </div>
                          <h3 className="text-white font-semibold text-sm">Investment Stages</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {stageTags.slice(0, 3).map((tag: VCTag) => (
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
                          {industryTags.slice(0, 3).map((tag: VCTag) => (
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

                    {/* Regions */}
                    {regionTags.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-emerald-400 text-xs">🌍</span>
                          </div>
                          <h3 className="text-white font-semibold text-sm">Regions</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {regionTags.map((tag: VCTag) => (
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
                      href={vc.website || '#'} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn block w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-green-500/25 hover:scale-[1.02]"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Visit Website
                        <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </span>
                    </a>
                    <button className="group/btn block w-full bg-gray-700/50 text-gray-300 text-center py-3 px-4 rounded-xl font-semibold hover:bg-gray-600/50 hover:text-white transition-all duration-200 border border-gray-600/50 hover:border-gray-500/50">
                      <span className="flex items-center justify-center gap-2">
                        Contact VC
                        <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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