import { createClient } from '../../../../utils/supabase/server';
import GrantQuestionnaire from '../../../../components/feature/GrantQuestionnaire';

// This is a helper function to group our tags
const groupTagsByType = (tags: { id: number; name: string; type: string }[]) => {
  return tags.reduce((acc: Record<string, typeof tags>, tag) => {
    const type = tag.type || 'UNCATEGORIZED';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(tag);
    return acc;
  }, {});
};

// This is now a Server Component whose only job is to fetch data
export default async function GrantsQuestionnairePage() {
  const supabase = await createClient();
  
  // 1. Fetch all tags from the database
  const { data: tags, error } = await supabase
    .from('tags')
    .select('id, name, type');

  if (error || !tags) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Questionnaire</h1>
          <p className="text-gray-400">Please try again later.</p>
          <a href="/grants" className="inline-block mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
            ← Back to Grants
          </a>
        </div>
      </div>
    );
  }

  // 2. Group the tags into categories
  const groupedTags = groupTagsByType(tags);

  // 3. Render our new wizard component and pass it the data
  return <GrantQuestionnaire groupedTags={groupedTags} />;
} 