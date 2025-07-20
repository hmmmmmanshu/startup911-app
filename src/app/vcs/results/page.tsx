// app/vcs/results/page.tsx

import Link from 'next/link';
import { createClient } from '../../../../utils/supabase/server';
import type { VC } from '../../../../lib/types'; // Import our defined VC type

type PageProps = { searchParams: Promise<{ [key: string]: string | undefined }> };

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
  const allSelectedIds = [...selectedIndustryIds, ...selectedStageIds, ...selectedRegionIds];

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
    // @ts-expect-error - Safely handling complex Supabase join types
    const vcTagIds = vc.vc_tags.map(vt => vt.tags.id);
    
    // Increment score for each match
    allSelectedIds.forEach(selectedId => {
      if (vcTagIds.includes(selectedId)) {
        matchScore++;
      }
    });

    return { ...vc, matchScore };
  });

  const sortedVCs = scoredVCs.sort((a, b) => b.matchScore - a.matchScore);

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
              const vcTags = vc.vc_tags.map(vt => vt.tags);
              const stageTags = vcTags.filter((tag: any) => tag.type === null && ['Angel', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series C+', 'Pre-Series A'].includes(tag.name));
              const industryTags = vcTags.filter((tag: any) => tag.type === null && !['Angel', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series C+', 'Pre-Series A'].includes(tag.name));
              const regionTags = vcTags.filter((tag: any) => tag.type === 'REGION');
              
              return (
                <div key={vc.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                  {/* Top Section */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-xl font-bold text-white">{vc.name}</h2>
                      <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Score: {vc.matchScore}
                      </div>
                    </div>
                    
                    {vc.country_based_of && (
                      <p className="text-green-400 text-sm font-medium mb-2">
                        Based in {vc.country_based_of}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
                    {vc.about}
                  </p>

                  {/* Investment Stages */}
                  {stageTags.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-white font-semibold text-sm mb-2">Investment Stages:</h3>
                      <div className="flex flex-wrap gap-1">
                        {stageTags.slice(0, 3).map((tag: any) => (
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
                        {industryTags.slice(0, 3).map((tag: any) => (
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

                  {/* Regions */}
                  {regionTags.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-white font-semibold text-sm mb-2">Regions:</h3>
                      <div className="flex flex-wrap gap-1">
                        {regionTags.map((tag: any) => (
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
                      href={vc.website || '#'} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-green-500 text-white text-center py-2 px-4 rounded-lg font-semibold hover:bg-green-400 transition-colors"
                    >
                      Visit Website
                    </a>
                    <button className="block w-full bg-blue-500 text-white text-center py-2 px-4 rounded-lg font-semibold hover:bg-blue-400 transition-colors">
                      Contact VC
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