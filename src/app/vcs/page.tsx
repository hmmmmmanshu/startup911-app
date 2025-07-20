import { createClient } from '../../../utils/supabase/server';
import VCQuestionnaire from '../../../components/feature/VCQuestionnaire';
import type { Tag } from '../../../lib/types';

// This is a helper function to group our tags
const groupTagsByType = (tags: Tag[]) => {
  return tags.reduce((acc: { [key: string]: Tag[] }, tag) => {
    const type = tag.type || 'UNCATEGORIZED';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(tag);
    return acc;
  }, {});
};

// This is the VCs Page, now fully type-safe
export default async function VCsPage() {
  const supabase = await createClient();
  
  // Fetch all tags from the database
  const { data: tagsData, error } = await supabase
    .from('tags')
    .select('id, name, type');

  const tags: Tag[] = tagsData || [];

  if (error) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Questions</h1>
          <p className="text-gray-400 mb-6">Please try again later.</p>
        </div>
      </div>
    );
  }

  // Group the tags into categories
  const groupedTags = groupTagsByType(tags);

  // After fetching tags - get all countries and make them distinct
  const { data: countriesData } = await supabase.from('vcs').select('country_based_of');
  const allCountries = countriesData?.map(d => d.country_based_of).filter(Boolean) || [];
  const countries = [...new Set(allCountries)].sort();

  // Render our wizard component and pass it the data
  return <VCQuestionnaire groupedTags={groupedTags} countries={countries} />;
} 