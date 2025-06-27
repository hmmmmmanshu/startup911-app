import { createClient } from '../../../../utils/supabase/server';
import { notFound } from 'next/navigation';

interface MentorResult {
  id: string;
  name: string;
  photo_url: string | null;
  superpower: string | null;
  about: string | null;
  rate_tier: string | null;
  languages: string[];
  linkedin_url: string | null;
  calendly_url: string | null;
  is_active: boolean;
  mentor_tags: {
    tags: {
      id: string;
      name: string;
      type: string | null;
    };
  }[];
}

interface MentorWithScore extends MentorResult {
  matchScore: number
  matchingTags: string[]
  tier: number
  tierLabel: string
  matchReasons: string[]
}

// Helper function to get badge color based on rate tier
const getRateTierColor = (tier: string | null) => {
  switch (tier) {
    case 'Free': return 'bg-green-100 text-green-800';
    case '<₹1K': return 'bg-blue-100 text-blue-800';
    case '₹1K-3K': return 'bg-yellow-100 text-yellow-800';
    case '₹3K-5K': return 'bg-orange-100 text-orange-800';
    case '₹5K+': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Helper function to get rate tier order for sorting
const getRateTierOrder = (tier: string | null) => {
  switch (tier) {
    case 'Free': return 0;
    case '<₹1K': return 1;
    case '₹1K-3K': return 2;
    case '₹3K-5K': return 3;
    case '₹5K+': return 4;
    default: return 5;
  }
};

export default async function MentorResultsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = await createClient();

  // Extract search parameters
  const industries = Array.isArray(searchParams.industries)
    ? searchParams.industries
    : searchParams.industries?.split(',') || [];
  const languages = Array.isArray(searchParams.languages)
    ? searchParams.languages
    : searchParams.languages?.split(',') || [];
  const budget = searchParams.budget as string;

  // If no search criteria provided, redirect to questionnaire
  if (industries.length === 0 && languages.length === 0 && !budget) {
    notFound();
  }

  // Build the query with filters
  let query = supabase
    .from('mentors')
    .select(`
      id,
      name,
      photo_url,
      superpower,
      about,
      rate_tier,
      languages,
      linkedin_url,
      calendly_url,
      is_active,
      mentor_tags (
        tags (
          id,
          name,
          type
        )
      )
    `)
    .eq('is_active', true);

  // Get all mentors first, then filter in memory for complex criteria
  const { data: allMentors, error } = await query;

  if (error || !allMentors) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Results</h1>
          <p className="text-gray-400">Please try your search again.</p>
          <a href="/mentors" className="inline-block mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
            ← Back to Questionnaire
          </a>
        </div>
      </div>
    );
  }

  // Hard filter: Budget (non-negotiable requirement)
  let budgetFilteredMentors = allMentors;
  if (budget && budget !== 'Any') {
    budgetFilteredMentors = allMentors.filter((mentor: any) => {
      return mentor.rate_tier === budget;
    });
  }

  // V2: Calculate match scores and tiers for mentors
  const scoredMentors: MentorWithScore[] = budgetFilteredMentors.map((mentor: any) => {
    let matchScore = 0;
    const matchingTags: string[] = [];
    const matchReasons: string[] = [];

    // Track which categories have been matched
    let matchedIndustry = false;
    let matchedLanguage = false;

    // Check for industry matches
    const mentorTags = mentor.mentor_tags.map((mt: any) => mt.tags.name);
    if (industries.length > 0) {
      const industryMatches = industries.filter(industry => 
        mentorTags.includes(industry)
      );
      if (industryMatches.length > 0) {
        matchedIndustry = true;
        matchScore += 50;
        matchingTags.push(...industryMatches);
        matchReasons.push(`Expert in ${industryMatches.join(', ')}`);
      }
    }

    // Check for language matches
    if (languages.length > 0) {
      const languageMatches = languages.filter((lang: any) => 
        mentor.languages.includes(lang)
      );
      if (languageMatches.length > 0) {
        matchedLanguage = true;
        matchScore += 30;
        matchingTags.push(...languageMatches);
        matchReasons.push(`Speaks ${languageMatches.join(', ')}`);
      }
    }

    // Bonus points for budget match
    if (budget && mentor.rate_tier === budget) {
      matchScore += 20;
      matchReasons.push(`Matches your budget (${budget})`);
    }

    // V2: Calculate tier based on match quality
    let tier = 4;
    let tierLabel = 'Basic Match';

    if (matchedIndustry && matchedLanguage) {
      tier = 1;
      tierLabel = 'Perfect Match';
    } else if (matchedIndustry) {
      tier = 2;
      tierLabel = 'Expertise Match';
    } else if (matchedLanguage) {
      tier = 3;
      tierLabel = 'Communication Match';
    }

    return {
      ...mentor,
      matchScore,
      matchingTags,
      tier,
      tierLabel,
      matchReasons
    };
  });

  // V2: Sort by tier first, then by match score, then by rate tier
  const sortedMentors = scoredMentors.sort((a, b) => {
    // Primary sort: tier (lower tier number = better match)
    if (a.tier !== b.tier) {
      return a.tier - b.tier;
    }
    // Secondary sort: match score within same tier (higher score = better)
    if (a.matchScore !== b.matchScore) {
      return b.matchScore - a.matchScore;
    }
    // Tertiary sort: rate tier (cheaper first)
    return getRateTierOrder(a.rate_tier) - getRateTierOrder(b.rate_tier);
  });

  const filteredMentors = sortedMentors;

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <a href="/mentors" className="text-green-500 hover:text-green-400 transition-colors">
              ← Back to Questionnaire
            </a>
            <a href="/" className="text-gray-400 hover:text-white transition-colors">
              Home
            </a>
          </div>
          <h1 className="text-3xl font-bold mb-2">Mentor Search Results</h1>
          <p className="text-gray-400">
            Found {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''} matching your criteria
          </p>
        </div>
      </div>

      {/* Search Criteria Summary */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Your Search Criteria:</h3>
          <div className="flex flex-wrap gap-4">
            {industries.length > 0 && (
              <div>
                <span className="text-green-500 font-medium">Industries: </span>
                <span className="text-gray-300">{industries.join(', ')}</span>
              </div>
            )}
            {languages.length > 0 && (
              <div>
                <span className="text-green-500 font-medium">Languages: </span>
                <span className="text-gray-300">{languages.join(', ')}</span>
              </div>
            )}
            {budget && budget !== 'Any' && (
              <div>
                <span className="text-green-500 font-medium">Budget: </span>
                <span className="text-gray-300">{budget} per hour</span>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {filteredMentors.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">No mentors found</h2>
            <p className="text-gray-400 mb-6">
              Try adjusting your search criteria to find more mentors.
            </p>
            <a href="/mentors" className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
              Modify Search
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors"
              >
                {/* Profile Header */}
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={mentor.photo_url || '/placeholder-avatar.jpg'}
                    alt={mentor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-lg font-semibold">{mentor.name}</h3>
                      <div className="text-right ml-2">
                        <div className={`font-bold text-xs mb-1 ${
                          mentor.tier === 1 ? 'text-green-400' :
                          mentor.tier === 2 ? 'text-blue-400' :
                          mentor.tier === 3 ? 'text-yellow-400' :
                          'text-gray-400'
                        }`}>
                          {mentor.tierLabel}
                        </div>
                        <div className="text-gray-300 font-medium text-sm">{mentor.matchScore}% Match</div>
                      </div>
                    </div>
                    {mentor.superpower && (
                      <p className="text-green-500 text-sm font-medium">{mentor.superpower}</p>
                    )}
                    {mentor.rate_tier && (
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getRateTierColor(mentor.rate_tier)}`}>
                        {mentor.rate_tier} per hour
                      </span>
                    )}
                  </div>
                </div>

                {/* Match Reasons */}
                {mentor.matchReasons.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">Why this matches:</p>
                    <div className="flex flex-col gap-1">
                      {mentor.matchReasons.map((reason, index) => (
                        <p key={index} className="text-green-300 text-sm">• {reason}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* About */}
                {mentor.about && (
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {mentor.about}
                  </p>
                )}

                {/* Languages */}
                {mentor.languages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Languages:</p>
                    <div className="flex flex-wrap gap-1">
                      {mentor.languages.map((lang: any) => (
                        <span
                          key={lang}
                          className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expertise Tags */}
                {mentor.mentor_tags.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Expertise:</p>
                    <div className="flex flex-wrap gap-1">
                      {mentor.mentor_tags.slice(0, 3).map((mentorTag: any) => (
                        <span
                          key={mentorTag.tags.id}
                          className="bg-green-900 text-green-300 px-2 py-1 rounded text-xs"
                        >
                          {mentorTag.tags.name}
                        </span>
                      ))}
                      {mentor.mentor_tags.length > 3 && (
                        <span className="text-gray-500 text-xs">
                          +{mentor.mentor_tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  {mentor.linkedin_url && (
                    <a
                      href={mentor.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      LinkedIn
                    </a>
                  )}
                  {mentor.calendly_url && (
                    <a
                      href={mentor.calendly_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Book Session
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 