import { createClient } from '../../../utils/supabase/server';
import MentorQuestionnaire from '../../../components/feature/MentorQuestionnaire';
import type { Tag } from '../../../lib/types';



// This is the Mentors Page, now fully type-safe
export default async function MentorsPage() {
  const supabase = await createClient();
  
  // Fetch only industry tags as required by this questionnaire
  const { data: industryTagsData, error } = await supabase
    .from('tags')
    .select('id, name, type')
    .eq('type', 'INDUSTRY');

  const industryTags: Tag[] = industryTagsData || [];

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

  // Render our wizard component and pass it the data
  return <MentorQuestionnaire industryTags={industryTags} />;
} 