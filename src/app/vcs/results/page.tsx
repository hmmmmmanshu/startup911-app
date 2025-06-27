import { createClient } from '../../../../utils/supabase/server';
import type { VC, VCWithScore, Tag } from '../../../../lib/types';

interface VCsResultsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Helper function to parse search parameters
function parseSearchParams(params: { [key: string]: string | string[] | undefined }) {
  const result: { [key: string]: number[] | string[] } = {}
  
  Object.entries(params).forEach(([key, value]) => {
    if (value && typeof value === 'string') {
      if (key === 'location') {
        // Locations are region IDs now
        result[key] = value.split(',').map(v => v.trim()).filter(Boolean)
      } else {
        // Convert tag IDs to numbers
        result[key] = value.split(',').map(v => parseInt(v.trim())).filter(id => !isNaN(id))
      }
    }
  })
  
  return result
}

// Helper function to get countries for selected regions
function getCountriesForRegions(regionIds: string[]): string[] {
  const geographicalRegions = [
    {
      id: 'southeast_asia',
      name: 'Southeast Asia',
      countries: ['Singapore', 'Indonesia', 'Vietnam', 'Malaysia', 'Thailand', 'Philippines', 'Cambodia', 'Myanmar', 'Republic of the Union of Myanmar']
    },
    {
      id: 'east_asia',
      name: 'East Asia',
      countries: ['China', 'Hong Kong', 'Japan', 'South Korea', 'Taiwan']
    },
    {
      id: 'south_asia',
      name: 'South Asia',
      countries: ['India', 'Pakistan', 'Bangladesh', 'Maldives']
    },
    {
      id: 'oceania',
      name: 'Australia & Oceania',
      countries: ['Australia']
    },
    {
      id: 'north_america',
      name: 'North America',
      countries: ['United States', 'Canada']
    },
    {
      id: 'europe',
      name: 'Europe',
      countries: ['United Kingdom', 'Germany', 'France', 'Italy', 'Switzerland', 'Netherlands', 'Czechia', 'Luxembourg', 'Cyprus', 'Romania', 'Malta', 'Sweden', 'Poland']
    },
    {
      id: 'middle_east',
      name: 'Middle East',
      countries: ['United Arab Emirates', 'Saudi Arabia', 'Turkey', 'Israel']
    },
    {
      id: 'latin_america',
      name: 'Latin America',
      countries: ['Brazil', 'Peru', 'Argentina']
    },
    {
      id: 'africa',
      name: 'Africa',
      countries: ['Morocco', 'Ghana']
    },
    {
      id: 'caribbean',
      name: 'Caribbean & Offshore',
      countries: ['Cayman Islands']
    }
  ];

  const allCountries: string[] = [];
  regionIds.forEach(regionId => {
    const region = geographicalRegions.find(r => r.id === regionId);
    if (region) {
      allCountries.push(...region.countries);
    }
  });

  return allCountries;
}

// Helper function to get region name by ID
function getRegionNameById(regionId: string): string {
  const regionMap: { [key: string]: string } = {
    'southeast_asia': 'Southeast Asia',
    'east_asia': 'East Asia',
    'south_asia': 'South Asia',
    'oceania': 'Australia & Oceania',
    'north_america': 'North America',
    'europe': 'Europe',
    'middle_east': 'Middle East',
    'latin_america': 'Latin America',
    'africa': 'Africa',
    'caribbean': 'Caribbean & Offshore'
  };
  return regionMap[regionId] || regionId;
}

// Helper function to get VC tags from junction table
async function getVCTags(supabase: Awaited<ReturnType<typeof createClient>>, vcId: number): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('vc_tags')
    .select(`
      tags (
        id,
        name,
        type
      )
    `)
    .eq('vc_id', vcId)

  if (error || !data) {
    return []
  }

  return data.map((item) => item.tags).filter(Boolean) as Tag[]
}

export default async function VCsResultsPage({ searchParams }: VCsResultsPageProps) {
  const params = await searchParams
  const userSelections = parseSearchParams(params)
  
  const supabase = await createClient()

  // 1. Fetch all VCs and tags
  const [vcsResult, tagsResult] = await Promise.all([
    supabase.from('vcs').select('*'),
    supabase.from('tags').select('*')
  ])

  if (vcsResult.error || tagsResult.error || !vcsResult.data || !tagsResult.data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Results</h1>
          <p className="text-gray-400">Please try again later.</p>
          <a href="/vcs" className="inline-block mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
            ← Back to Questionnaire
          </a>
        </div>
      </div>
    )
  }

  const allVCs: VC[] = vcsResult.data
  const allTags: Tag[] = tagsResult.data

  // Create tag lookup map
  const tagById = new Map(allTags.map(tag => [tag.id, tag]))

  // 2. Filter VCs by region if specified
  let filteredVCs = allVCs
  if (userSelections.location && userSelections.location.length > 0) {
    const selectedRegions = userSelections.location as string[]
    const selectedCountries = getCountriesForRegions(selectedRegions)
    filteredVCs = allVCs.filter(vc => 
      vc.country_based_of && selectedCountries.some(country => 
        vc.country_based_of === country || 
        vc.country_based_of?.includes(country) // Handle cases like "Singapore, United States"
      )
    )
  }

  // 3. Calculate match scores and tiers for remaining VCs using V2 algorithm
  const scoredVCs: VCWithScore[] = await Promise.all(
    filteredVCs.map(async (vc) => {
      const vcTags = await getVCTags(supabase, vc.id)
      let matchScore = 0
      const matchingTags: Tag[] = []
      const matchReasons: string[] = []

      // Track which categories have been matched (V2: Cap scoring per category)
      let matchedStage = false
      let matchedIndustry = false

      // Check for stage matches
      const userStageIds = userSelections.stage as number[] || []
      if (userStageIds.length > 0) {
        const stageMatch = vcTags.find(tag => userStageIds.includes(tag.id))
        if (stageMatch) {
          matchedStage = true
          matchScore += 40
          matchingTags.push(stageMatch)
          matchReasons.push(`Invests in ${stageMatch.name} stage`)
        }
      }

      // Check for industry matches (including special "Sector Agnostic" logic)
      const userIndustryIds = userSelections.industry as number[] || []
      if (userIndustryIds.length > 0) {
        // Check if VC is sector agnostic
        const sectorAgnosticTag = vcTags.find(tag => 
          tag.name.toLowerCase().includes('sector agnostic') || 
          tag.name.toLowerCase().includes('agnostic')
        )
        
        if (sectorAgnosticTag) {
          matchedIndustry = true
          matchScore += 35
          matchingTags.push(sectorAgnosticTag)
          matchReasons.push('Sector Agnostic (invests across industries)')
        } else {
          // Look for specific industry matches
          const industryMatches = vcTags.filter(tag => userIndustryIds.includes(tag.id))
          if (industryMatches.length > 0) {
            matchedIndustry = true
            matchScore += 35
            matchingTags.push(...industryMatches)
            matchReasons.push(`Invests in ${industryMatches.map(t => t.name).join(', ')}`)
          }
        }
      }

      // Check for investment type matches
      const userInvestmentTypeIds = userSelections.investment_type as number[] || []
      if (userInvestmentTypeIds.length > 0) {
        const investmentTypeMatches = vcTags.filter(tag => userInvestmentTypeIds.includes(tag.id))
        if (investmentTypeMatches.length > 0) {
          matchScore += 25
          matchingTags.push(...investmentTypeMatches)
          matchReasons.push(`Focus: ${investmentTypeMatches.map(t => t.name).join(', ')}`)
        }
      }

      // V2: Calculate tier based on match quality
      let tier = 4
      let tierLabel = 'Other Match'

      if (matchedStage && matchedIndustry) {
        tier = 1
        tierLabel = 'Perfect Match'
      } else if (matchedStage) {
        tier = 2
        tierLabel = 'Strong Match'
      } else if (matchedIndustry) {
        tier = 3
        tierLabel = 'Speculative Match'
      }

      return {
        ...vc,
        matchScore,
        matchingTags,
        tier,
        tierLabel,
        matchReasons
      }
    })
  )

  // 4. V2: Sort by tier first, then by match score within each tier
  const sortedVCs = scoredVCs.sort((a, b) => {
    // Primary sort: tier (lower tier number = better match)
    if (a.tier !== b.tier) {
      return a.tier - b.tier
    }
    // Secondary sort: match score within same tier (higher score = better)
    return b.matchScore - a.matchScore
  })

  // Get selected tag names for display
  const getSelectedTagNames = (categoryIds: number[]) => {
    return categoryIds.map(id => tagById.get(id)?.name).filter(Boolean)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Your VC Matches</h1>
          <p className="text-gray-400">
            Found {sortedVCs.length} venture capital firms matching your criteria
          </p>
        </div>

        {/* Selected Criteria Summary */}
        {Object.keys(userSelections).length > 0 && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Selection:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {userSelections.stage && (userSelections.stage as number[]).length > 0 && (
                <div>
                  <h3 className="text-green-400 font-medium mb-2">Funding Stage:</h3>
                  <p className="text-sm text-gray-300">
                    {getSelectedTagNames(userSelections.stage as number[]).join(', ')}
                  </p>
                </div>
              )}
              {userSelections.industry && (userSelections.industry as number[]).length > 0 && (
                <div>
                  <h3 className="text-green-400 font-medium mb-2">Industry:</h3>
                  <p className="text-sm text-gray-300">
                    {getSelectedTagNames(userSelections.industry as number[]).join(', ')}
                  </p>
                </div>
              )}
              {userSelections.investment_type && (userSelections.investment_type as number[]).length > 0 && (
                <div>
                  <h3 className="text-green-400 font-medium mb-2">Investment Type:</h3>
                  <p className="text-sm text-gray-300">
                    {getSelectedTagNames(userSelections.investment_type as number[]).join(', ')}
                  </p>
                </div>
              )}
              {userSelections.location && (userSelections.location as string[]).length > 0 && (
                <div>
                  <h3 className="text-green-400 font-medium mb-2">Regions:</h3>
                  <p className="text-sm text-gray-300">
                    {(userSelections.location as string[]).map(regionId => getRegionNameById(regionId)).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {sortedVCs.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">No VCs Found</h2>
            <p className="text-gray-400 mb-6">
              Try adjusting your criteria to find more matches.
            </p>
            <a href="/vcs" className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
              ← Update Criteria
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {sortedVCs.map((vc) => (
              <div key={vc.id} className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{vc.name}</h3>
                    {vc.country_based_of && (
                      <p className="text-gray-400 text-sm mb-2">📍 {vc.country_based_of}</p>
                    )}
                    {vc.key_person && (
                      <p className="text-gray-400 text-sm">👤 {vc.key_person}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-sm mb-1 ${
                      vc.tier === 1 ? 'text-green-400' :
                      vc.tier === 2 ? 'text-blue-400' :
                      vc.tier === 3 ? 'text-yellow-400' :
                      'text-gray-400'
                    }`}>
                      {vc.tierLabel}
                    </div>
                    <div className="text-gray-300 font-medium text-lg">{vc.matchScore}% Match</div>
                  </div>
                </div>

                {/* Match Reasons */}
                {vc.matchReasons.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">Why this matches:</p>
                    <div className="flex flex-col gap-1">
                      {vc.matchReasons.map((reason, index) => (
                        <p key={index} className="text-green-300 text-sm">• {reason}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* About */}
                {vc.about && (
                  <div className="mb-4">
                    <p className="text-gray-300 text-sm">{vc.about}</p>
                  </div>
                )}

                {/* Matching Tags */}
                {vc.matchingTags.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">Matching criteria:</p>
                    <div className="flex flex-wrap gap-1">
                      {vc.matchingTags.map(tag => (
                        <span key={tag.id} className="bg-green-900/30 text-green-400 px-2 py-1 rounded text-xs">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Links */}
                <div className="flex gap-3 mt-4">
                  {vc.website && (
                    <a
                      href={vc.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Visit Website
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  {vc.linkedin && (
                    <a
                      href={vc.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      LinkedIn
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Questionnaire */}
        <div className="text-center mt-12">
          <a href="/vcs" className="inline-block px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors">
            ← Start New Search
          </a>
        </div>
      </div>
    </div>
  )
} 