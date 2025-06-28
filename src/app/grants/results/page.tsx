import Link from 'next/link';
import { createClient } from '../../../../utils/supabase/server';
import type { Grant, Tag, ScoredGrant } from '../../../../lib/types';

// Helper to safely parse numbers from the URL
const parseIds = (param: string | undefined) => param?.split(',').map(Number).filter(Boolean) || [];

// Main Page Component - Rewritten for type safety and correctness
export default async function GrantsResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key:string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  
  const supabase = await createClient();

  // --- 1. PARSE USER INPUT ---
  const selectedStageIds = parseIds(params.STAGE?.toString());
  const selectedIndustryIds = parseIds(params.INDUSTRY?.toString());
  const selectedRequirementIds = parseIds(params.REQUIREMENT?.toString());
  const selectedLocationIds = parseIds(params.LOCATION?.toString());
  const selectedSocialImpactIds = parseIds(params.SOCIAL_IMPACT?.toString());
  const selectedSpecialCategoryIds = parseIds(params.SPECIAL_CATEGORY?.toString());

  // --- 2. FETCH DATA ---
  const { data: grantsData, error } = await supabase
    .from('grants')
    .select('*, grant_tags(tags(id, name, type))');

  // Explicitly type the fetched data
  const grants: Grant[] = grantsData || [];

  const { data: allTagsData } = await supabase.from('tags').select('id, name');
  const allTags: {id: number, name: string}[] = allTagsData || [];
  
  if (error) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Grants</h1>
          <p className="text-gray-400 mb-6">Could not load grants. Please try again.</p>
          <Link href="/grants" className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
            ← Back to Grants
          </Link>
        </div>
      </div>
    );
  }

  const requirementMap = new Map(allTags.map(tag => [tag.id, tag.name]));

  // --- 3. ALGORITHM: FILTER & SCORE ---

  // Part A: Hard Filter
  const filteredGrants = grants.filter(grant => {
    const userHasRequirement = (name: string) => selectedRequirementIds.some(id => requirementMap.get(id) === name);
    if (grant.dpiit_required && !userHasRequirement('DPIIT Registration')) return false;
    if (grant.patent_required && !userHasRequirement('Patent/IP')) return false;
    if (grant.prototype_required && !userHasRequirement('Working Prototype')) return false;
    if (grant.technical_cofounder_required && !userHasRequirement('Technical Co-founder')) return false;
    if (grant.full_time_commitment && !userHasRequirement('Full-time Commitment')) return false;
    if (grant.women_led_focus && !selectedSpecialCategoryIds.some(id => requirementMap.get(id) === 'Women-Led Startup')) return false;
    if (grant.student_focus && !selectedSpecialCategoryIds.some(id => requirementMap.get(id) === 'Student Startup')) return false;
    return true;
  });

  // Part B: Weighted Scoring
  const scoredGrants: ScoredGrant[] = filteredGrants.map(grant => {
    let matchScore = 0;
    
    // This correctly extracts all tag IDs associated with a grant
    const grantTagIds = grant.grant_tags?.map(gt => gt.tags.id) || [];

    if (selectedStageIds.some(id => grantTagIds.includes(id))) matchScore += 25;
    if (selectedIndustryIds.some(id => grantTagIds.includes(id))) matchScore += 25;
    if (selectedLocationIds.some(id => grantTagIds.includes(id))) matchScore += 10;
    if (selectedSocialImpactIds.some(id => grantTagIds.includes(id))) matchScore += 10;

    return { ...grant, matchScore } as ScoredGrant;
  }).filter(grant => grant.matchScore > 0); // Only show grants with a score > 0

  // --- 4. SORT RESULTS ---
  const sortedGrants = scoredGrants.sort((a, b) => b.matchScore - a.matchScore);

  // --- 5. RENDER UI ---
  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Recommended Grants
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Based on your selections, here are the best matches for you
          </p>
          <Link href="/grants" className="text-green-500 hover:text-green-400 transition-colors">
            ← Back to Questionnaire
          </Link>
        </div>

        {/* Results */}
        {sortedGrants.length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-8 max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold mb-4">No Grants Found</h2>
            <p className="text-gray-400 mb-6">
              Try adjusting your selections for a broader search.
            </p>
            <Link
              href="/grants"
              className="inline-block px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              Modify Search
            </Link>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedGrants.map(grant => (
                <div key={grant.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-green-500 transition-colors">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{grant.name}</h3>
                      {grant.organization && (
                        <p className="text-green-400 font-medium">{grant.organization}</p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="bg-green-600 text-black px-3 py-1 rounded-full text-sm font-bold">
                        {grant.matchScore}% Match
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  {grant.details && (
                    <p className="text-gray-300 mb-4 line-clamp-3">{grant.details}</p>
                  )}

                  {/* Grant Info */}
                  <div className="space-y-2 mb-4">
                    {grant.amount_max && (
                      <div className="flex items-center text-sm">
                        <span className="text-gray-400 w-20">Amount:</span>
                        <span className="text-white font-medium">{grant.amount_max}</span>
                      </div>
                    )}
                    {grant.application_deadline && (
                      <div className="flex items-center text-sm">
                        <span className="text-gray-400 w-20">Deadline:</span>
                        <span className="text-white">{new Date(grant.application_deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    {grant.status && (
                      <div className="flex items-center text-sm">
                        <span className="text-gray-400 w-20">Status:</span>
                        <span className="text-white">{grant.status}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="text-right">
                    {grant.application_link ? (
                      <a
                        href={grant.application_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        Apply Now
                      </a>
                    ) : (
                      <span className="inline-block px-6 py-2 bg-gray-600 text-gray-300 font-semibold rounded-lg cursor-not-allowed">
                        Details Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 