import { createClient } from '../../../utils/supabase/server';
import MentorQuestionnaire from '../../../components/feature/MentorQuestionnaire';
import Link from 'next/link';
import type { Tag } from '../../../lib/types';

// Helper function to filter industry tags for mentors
const getIndustryTags = (tags: Tag[]) => {
  // Define common industries that mentors typically specialize in
  const mentorIndustries = [
    'Finance', 'Health Care', 'Consumer', 'Enterprise', 'Bio Tech', 'Web3', 
    'Education', 'E-commerce', 'B2B', 'Artificial Intelligence', 'Real Estate',
    'Media and Entertainment', 'Social Media', 'Information Technology', 'Software',
    'SaaS', 'Logistics', 'Food and Beverage', 'Insurance', 'Climate Tech',
    'Agriculture', 'Blockchain', 'Sustainability', 'Banking', 'Robotics',
    'Telecommunications', 'Payments', 'Marketplace', 'Mobile', 'Transportation',
    'Deep tech', 'Medical', 'Medical Device', 'Renewable Energy', 'Marketing',
    'Sales', 'Product Management', 'Design', 'Legal', 'HR', 'Operations'
  ];

  // Filter tags that are either explicitly typed as INDUSTRY or match mentor industry names
  return tags.filter(tag => 
    tag.type === 'INDUSTRY' || mentorIndustries.includes(tag.name)
  ).sort((a, b) => a.name.localeCompare(b.name));
};

// This is an async Server Component that fetches data from Supabase
export default async function MentorsPage() {
  const supabase = await createClient();
  
  // Fetch all tags from the database
  const { data: tags, error } = await supabase
    .from('tags')
    .select('id, name, type');

  if (error || !tags) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Questionnaire</h1>
          <p className="text-gray-400">Please try again later.</p>
          <Link href="/" className="inline-block mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Filter and prepare industry tags for mentors
  const industryTags = getIndustryTags(tags);

  // Render the MentorQuestionnaire component with the industry tags
  return <MentorQuestionnaire industryTags={industryTags} />;
} 