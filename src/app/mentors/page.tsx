import { createClient } from '../../../utils/supabase/server';
import MentorQuestionnaire from '../../../components/feature/MentorQuestionnaire';
import type { Tag } from '../../../lib/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Startup Mentors India | Connect with Industry Experts & Advisors',
  description: 'Find experienced startup mentors in India. Connect with industry experts, successful entrepreneurs, and advisors across different sectors. Get guidance for your startup journey.',
  keywords: 'startup mentors india, industry mentors, startup advisors, entrepreneurship mentors, business mentors india, startup guidance, mentor matching, startup coaching india',
  openGraph: {
    title: 'Startup Mentors India | Connect with Industry Experts & Advisors',
    description: 'Find experienced startup mentors in India. Connect with industry experts and successful entrepreneurs.',
    url: 'https://startup911.in/mentors',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Startup Mentors India | Connect with Industry Experts & Advisors',
    description: 'Find experienced startup mentors in India. Connect with industry experts and successful entrepreneurs.',
  },
  alternates: {
    canonical: 'https://startup911.in/mentors',
  },
};

// This is the Mentors Page, now fully type-safe
export default async function MentorsPage() {
  const supabase = await createClient();
  
  // Fetch both industry and expertise tags for comprehensive mentor search
  const { data: tagsData } = await supabase.from('tags').select('*').in('type', ['INDUSTRY', 'EXPERTISE']);
  
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