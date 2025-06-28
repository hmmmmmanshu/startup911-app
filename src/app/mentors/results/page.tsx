import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '../../../../utils/supabase/server';
import type { Mentor } from '../../../../lib/types';

// Define the structure for mentor data with tags
interface MentorWithTags extends Mentor {
  mentor_tags: Array<{
    tags: {
      id: number;
      name: string;
      type: string;
    };
  }>;
}

// This is our main page component, now fully typed
export default async function MentorsResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  
  // --- 1. PARSE USER INPUT FROM URL ---
  const selectedIndustryIds = params.industry?.toString().split(',').map(Number) || [];
  const selectedLanguages = params.language?.toString().split(',') || [];
  const selectedBudget = params.budget?.toString() || '';

  // --- 2. BUILD AND EXECUTE A DYNAMIC SUPABASE QUERY ---
  const supabase = await createClient();
  
  // Start with base query
  let query = supabase
    .from('mentors')
    .select(`
      *,
      mentor_tags(
        tags(
          id,
          name,
          type
        )
      )
    `)
    .eq('is_active', true);

  // Dynamically add filters based on user input
  if (selectedBudget && selectedBudget !== 'Any') {
    query = query.eq('rate_tier', selectedBudget);
  }

  if (selectedLanguages.length > 0) {
    query = query.contains('languages', selectedLanguages);
  }
  
  // Execute the query
  const { data: mentors, error } = await query;

  if (error) {
    console.error('Error fetching mentors:', error);
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Mentors</h1>
          <p className="text-gray-400 mb-6">Could not load mentors. Please try again.</p>
          <Link href="/mentors" className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
            ← Back to Questionnaire
          </Link>
        </div>
      </div>
    );
  }

  if (!mentors || mentors.length === 0) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No mentors found</h2>
          <p className="text-gray-400 mb-6">Try adjusting your criteria to find more matches.</p>
          <Link href="/mentors" className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
            Modify Search
          </Link>
        </div>
      </div>
    );
  }
  
  // --- 3. FILTER BY INDUSTRY TAG ---
  // Filter mentors based on industry tags if specified
  const filteredMentors = selectedIndustryIds.length > 0
    ? (mentors as MentorWithTags[]).filter(mentor => 
        mentor.mentor_tags?.some(mt => selectedIndustryIds.includes(mt.tags.id))
      )
    : mentors as MentorWithTags[];

  // --- 4. RENDER THE UI ---
  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/mentors" className="text-green-500 hover:text-green-400 transition-colors">
              ← Back to Questionnaire
            </Link>
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              Home
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">Your Recommended Mentors</h1>
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
            {selectedLanguages.length > 0 && (
              <div>
                <span className="text-green-500 font-medium">Languages: </span>
                <span className="text-gray-300">{selectedLanguages.join(', ')}</span>
              </div>
            )}
            {selectedBudget && selectedBudget !== 'Any' && (
              <div>
                <span className="text-green-500 font-medium">Budget: </span>
                <span className="text-gray-300">{selectedBudget} per hour</span>
              </div>
            )}
            {selectedIndustryIds.length > 0 && (
              <div>
                <span className="text-green-500 font-medium">Industry Match: </span>
                <span className="text-gray-300">Selected</span>
              </div>
            )}
          </div>
        </div>

        {/* Results Grid */}
        {filteredMentors.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">No mentors found</h2>
            <p className="text-gray-400 mb-6">
              Try adjusting your search criteria to find more mentors.
            </p>
            <Link href="/mentors" className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
              Modify Search
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <div key={mentor.id} className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors">
                {/* Profile Photo */}
                <div className="text-center mb-4">
                  <Image
                    src={mentor.photo_url || '/logo.svg'}
                    alt={`Photo of ${mentor.name}`}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
                  />
                  <h3 className="text-xl font-semibold text-white">{mentor.name}</h3>
                  {mentor.superpower && (
                    <p className="text-green-400 text-sm font-medium mt-1">{mentor.superpower}</p>
                  )}
                  {mentor.rate_tier && (
                    <span className="inline-block px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-xs font-medium mt-2">
                      {mentor.rate_tier} per hour
                    </span>
                  )}
                </div>

                {/* About */}
                {mentor.about && (
                  <div className="mb-4">
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">{mentor.about}</p>
                  </div>
                )}

                {/* Languages */}
                {mentor.languages && mentor.languages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">Languages:</p>
                    <div className="flex flex-wrap gap-1">
                      {mentor.languages.map((language, index) => (
                        <span key={index} className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs">
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 mt-4">
                  {mentor.calendly_url && (
                    <a
                      href={mentor.calendly_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Book a Call
                    </a>
                  )}
                  {mentor.linkedin_url && (
                    <a
                      href={mentor.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      LinkedIn Profile
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Search */}
        <div className="text-center mt-12">
          <Link href="/mentors" className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
            Modify Search
          </Link>
        </div>
      </div>
    </div>
  );
} 