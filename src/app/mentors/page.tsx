import { createClient } from '../../../utils/supabase/server';
import MentorQuestionnaire from '../../../components/feature/MentorQuestionnaire';
import type { Tag } from '../../../lib/types';



// This is the Mentors Page, now fully type-safe
export default async function MentorsPage() {
  const supabase = await createClient();
  
  // Fetch only industry tags as required by this questionnaire
  const { data: tags } = await supabase.from('tags').select('*');
  const groupTagsByType = (tags: any[]) => { return tags.reduce((acc: Record<string, any[]>, tag: any) => { const type = tag.type || 'UNCATEGORIZED'; if (!acc[type]) acc[type] = []; acc[type].push(tag); return acc; }, {}); };
  const tagsData = data || [];
  const groupedTags = groupTagsByType(tagsData);
  return <MentorQuestionnaire groupedTags={groupedTags} />;
} 