import { createClient } from '../../../utils/supabase/server';
import MentorQuestionnaire from '../../../components/feature/MentorQuestionnaire';
import type { Tag } from '../../../lib/types';

// This is the Mentors Page, now fully type-safe
export default async function MentorsPage() {
  const supabase = await createClient();
  
  // Fetch only industry tags as required by this questionnaire
  const { data: tagsData } = await supabase.from('tags').select('*');
  
  const groupTagsByType = (tags: Array<{ id: number; name: string; type: string | null }>) => { 
    return tags.reduce((acc: Record<string, Tag[]>, tag) => { 
      const type = tag.type || 'UNCATEGORIZED'; 
      if (!acc[type]) acc[type] = []; 
      acc[type].push({ ...tag, type: type }); 
      return acc; 
    }, {}); 
  };
  
  const tags = tagsData || [];
  const groupedTags = groupTagsByType(tags);
  
  return <MentorQuestionnaire groupedTags={groupedTags} />;
} 