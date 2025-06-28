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
      const selectedIndustryIds = parseIds(params.INDUSTRY);
    const selectedStageIds = parseIds(params.STAGE);
    const selectedLocationIds = parseIds(params.LOCATION);
  const allSelectedIds = [...selectedIndustryIds, ...selectedStageIds, ...selectedLocationIds];

  // --- 2. FETCH DATA ---
  const { data: vcsData, error } = await supabase
    .from('vcs')
    .select('*, vc_tags(tags(id))');
  
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
  }).filter(vc => vc.matchScore > 0); // Only show VCs with at least one match

  const sortedVCs = scoredVCs.sort((a, b) => b.matchScore - a.matchScore);

  // --- 4. RENDER UI ---
  return (
    <div className="bg-black min-h-screen text-white p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-4">Recommended Venture Capital Firms</h1>
        <p className="text-center text-gray-400 mb-12">Based on your selections, here are the best matches for you.</p>

        {sortedVCs.length === 0 ? (
          <div className="text-center bg-gray-900 p-8 rounded-lg">
            <h2 className="text-2xl font-bold">No VCs found.</h2>
            <p className="text-gray-400 mt-2">Try adjusting your selections for a broader search.</p>
            <Link href="/vcs" className="mt-6 inline-block px-6 py-2 bg-purple-600 rounded-lg font-semibold hover:bg-purple-700">
              Go Back
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedVCs.map(vc => (
              <div key={vc.id} className="bg-[#1C1C1E] rounded-lg p-6 border border-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-purple-400">{vc.name}</h2>
                  </div>
                  <div className="bg-green-500/10 text-green-300 font-bold px-3 py-1 rounded-full text-sm">
                    Match Score: {vc.matchScore}
                  </div>
                </div>
                <p className="mt-4 text-gray-300 line-clamp-3">{vc.about}</p>
                <div className="mt-6 text-right">
                  <a 
                    href={vc.website || '#'} 
                      target="_blank"
                      rel="noopener noreferrer"
                    className="inline-block px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Visit Website
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 