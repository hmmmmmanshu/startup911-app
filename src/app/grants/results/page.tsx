import { createClient } from '../../../../utils/supabase/server'

interface GrantsResultsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Define types for our data structures
interface Tag {
  id: number
  name: string
  type: string
}

interface Grant {
  id: number
  name: string
  organization: string | null
  details: string | null
  status: string | null
  amount_max: string | null
  dpiit_required: boolean | null
  tech_focus_required: boolean | null
  patent_required: boolean | null
  prototype_required: boolean | null
  technical_cofounder_required: boolean | null
  full_time_commitment: boolean | null
  women_led_focus: boolean | null
  student_focus: boolean | null
  application_deadline: string | null
  application_link: string | null
  mentorship_included: boolean | null
  workspace_provided: boolean | null
  network_access: boolean | null
  created_at: string
}

interface GrantWithScore extends Grant {
  matchScore: number
  matchingTags: Tag[]
  tier: number
  tierLabel: string
  matchReasons: string[]
}

// Helper function to parse URL parameters into arrays of numbers
function parseSearchParams(params: { [key: string]: string | string[] | undefined }) {
  const parsed: { [key: string]: number[] } = {}
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      const valueStr = Array.isArray(value) ? value[0] : value
      parsed[key] = valueStr.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id))
    }
  })
  
  return parsed
}

// Helper function to get grant tags from junction table
async function getGrantTags(supabase: any, grantId: number): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('grant_tags')
    .select(`
      tags (
        id,
        name,
        type
      )
    `)
    .eq('grant_id', grantId)

  if (error || !data) {
    return []
  }

  return data.map((item: any) => item.tags).filter(Boolean)
}

export default async function GrantsResultsPage({ searchParams }: GrantsResultsPageProps) {
  const params = await searchParams
  const userSelections = parseSearchParams(params)
  
  const supabase = await createClient()

  // 1. Fetch all grants and tags
  const [grantsResult, tagsResult] = await Promise.all([
    supabase.from('grants').select('*'),
    supabase.from('tags').select('*')
  ])

  if (grantsResult.error || tagsResult.error || !grantsResult.data || !tagsResult.data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Results</h1>
          <p className="text-gray-400">Please try again later.</p>
          <a href="/grants" className="inline-block mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
            ← Back to Grants
          </a>
        </div>
      </div>
    )
  }

  const allGrants: Grant[] = grantsResult.data
  const allTags: Tag[] = tagsResult.data

  // Create tag lookup maps
  const tagById = new Map(allTags.map(tag => [tag.id, tag]))
  const requirementTags = allTags.filter(tag => tag.type === 'REQUIREMENT')
  const userRequirementIds = userSelections.requirement || []

  // 2. Part A: Hard Filter (Mandatory Requirements)
  const filteredGrants = allGrants.filter(grant => {
    // Check each boolean requirement field
    const requirements = [
      { field: grant.dpiit_required, tagName: 'DPIIT Registration' },
      { field: grant.patent_required, tagName: 'Patent/IP' },
      { field: grant.prototype_required, tagName: 'Working Prototype' },
      { field: grant.technical_cofounder_required, tagName: 'Technical Co-founder' },
      { field: grant.full_time_commitment, tagName: 'Full-time Commitment' }
    ]

    for (const req of requirements) {
      if (req.field === true) {
        // Grant requires this - check if user selected it
        const requiredTag = requirementTags.find(tag => tag.name === req.tagName)
        if (!requiredTag || !userRequirementIds.includes(requiredTag.id)) {
          return false // Exclude this grant
        }
      }
    }

    return true // Grant passes hard filter
  })

  // 3. Part B: V2 Weighted Scoring with Tiers
  const scoredGrants: GrantWithScore[] = await Promise.all(
    filteredGrants.map(async (grant) => {
      const grantTags = await getGrantTags(supabase, grant.id)
      let matchScore = 0
      const matchingTags: Tag[] = []
      const matchReasons: string[] = []

      // Track which categories have been matched (V2: Cap scoring per category)
      let matchedStage = false
      let matchedIndustry = false

      // Check for stage matches
      const userStageIds = userSelections.stage as number[] || []
      if (userStageIds.length > 0) {
        const stageMatches = grantTags.filter(tag => 
          tag.type === 'STAGE' && userStageIds.includes(tag.id)
        )
        if (stageMatches.length > 0) {
          matchedStage = true
          matchScore += 35
          matchingTags.push(...stageMatches)
          matchReasons.push(`Suitable for ${stageMatches.map(t => t.name).join(', ')} stage`)
        }
      }

      // Check for industry matches
      const userIndustryIds = userSelections.industry as number[] || []
      if (userIndustryIds.length > 0) {
        const industryMatches = grantTags.filter(tag => 
          tag.type === 'INDUSTRY' && userIndustryIds.includes(tag.id)
        )
        if (industryMatches.length > 0) {
          matchedIndustry = true
          matchScore += 35
          matchingTags.push(...industryMatches)
          matchReasons.push(`Targets ${industryMatches.map(t => t.name).join(', ')} industry`)
        }
      }

      // Check for location matches
      const userLocationIds = userSelections.location as number[] || []
      if (userLocationIds.length > 0) {
        const locationMatches = grantTags.filter(tag => 
          tag.type === 'LOCATION' && userLocationIds.includes(tag.id)
        )
        if (locationMatches.length > 0) {
          matchScore += 15
          matchingTags.push(...locationMatches)
          matchReasons.push(`Available in ${locationMatches.map(t => t.name).join(', ')}`)
        }
      }

      // Check for social impact matches
      const userSocialImpactIds = userSelections.social_impact as number[] || []
      if (userSocialImpactIds.length > 0) {
        const socialImpactMatches = grantTags.filter(tag => 
          tag.type === 'SOCIAL_IMPACT' && userSocialImpactIds.includes(tag.id)
        )
        if (socialImpactMatches.length > 0) {
          matchScore += 15
          matchingTags.push(...socialImpactMatches)
          matchReasons.push(`Supports ${socialImpactMatches.map(t => t.name).join(', ')}`)
        }
      }

      // V2: Calculate tier based on match quality
      let tier = 4
      let tierLabel = 'Basic Match'

      if (matchedStage && matchedIndustry) {
        tier = 1
        tierLabel = 'Perfect Match'
      } else if (matchedStage) {
        tier = 2
        tierLabel = 'Stage Match'
      } else if (matchedIndustry) {
        tier = 3
        tierLabel = 'Industry Match'
      }

      return {
        ...grant,
        matchScore,
        matchingTags,
        tier,
        tierLabel,
        matchReasons
      }
    })
  )

  // 4. V2: Sort by tier first, then by match score within each tier
  const sortedGrants = scoredGrants.sort((a, b) => {
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
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Recommended Grants
          </h1>
          <p className="text-xl text-gray-300">
            Found {sortedGrants.length} grants matching your criteria
          </p>
        </div>

        {/* User Selections Summary */}
        <div className="bg-gray-900 rounded-xl p-6 max-w-4xl mx-auto mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-400">Your Selections:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            {Object.entries(userSelections).map(([key, ids]) => {
              const names = getSelectedTagNames(ids)
              if (names.length === 0) return null
              return (
                <div key={key}>
                  <span className="text-gray-400 uppercase font-medium">{key.replace('_', ' ')}: </span>
                  <span className="text-white">{names.join(', ')}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Results */}
        {sortedGrants.length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-8 max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold mb-4">No Grants Found</h2>
            <p className="text-gray-400 mb-6">
              No grants found matching your specific criteria. Try adjusting your selections to see more opportunities.
            </p>
            <a 
              href="/grants" 
              className="inline-block px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              ← Back to Grants
            </a>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedGrants.map((grant) => (
                <div key={grant.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-green-500 transition-colors">
                  {/* Match Score Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{grant.name}</h3>
                      {grant.organization && (
                        <p className="text-green-400 font-medium">{grant.organization}</p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className={`font-bold text-xs mb-1 ${
                        grant.tier === 1 ? 'text-green-400' :
                        grant.tier === 2 ? 'text-blue-400' :
                        grant.tier === 3 ? 'text-yellow-400' :
                        'text-gray-400'
                      }`}>
                        {grant.tierLabel}
                      </div>
                      <div className="bg-green-600 text-black px-3 py-1 rounded-full text-sm font-bold">
                      {grant.matchScore}% Match
                      </div>
                    </div>
                  </div>

                  {/* Match Reasons */}
                  {grant.matchReasons.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-2">Why this matches:</p>
                      <div className="flex flex-col gap-1">
                        {grant.matchReasons.map((reason, index) => (
                          <p key={index} className="text-green-300 text-sm">• {reason}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Grant Details */}
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

                  {/* Matching Tags */}
                  {grant.matchingTags.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-2">Matching criteria:</p>
                      <div className="flex flex-wrap gap-1">
                        {grant.matchingTags.map(tag => (
                          <span key={tag.id} className="bg-green-900/30 text-green-400 px-2 py-1 rounded text-xs">
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  {grant.application_link ? (
                    <a
                      href={grant.application_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      Apply Now →
                    </a>
                  ) : (
                    <div className="w-full text-center bg-gray-700 text-gray-400 font-semibold py-3 px-6 rounded-lg">
                      Application Link Not Available
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Back to Search */}
            <div className="text-center mt-12">
              <a 
                href="/grants" 
                className="inline-block px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
              >
                ← Start New Search
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 