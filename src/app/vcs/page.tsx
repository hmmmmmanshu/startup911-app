import { createClient } from '../../../utils/supabase/server';
import VCQuestionnaire from '../../../components/feature/VCQuestionnaire';
import type { Tag } from '../../../lib/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Complete VC List India 2024 | 500+ Venture Capital Firms & Angel Investors',
  description: 'Connect with venture capital firms in India. Complete VC directory with investment criteria, portfolio companies, and contact details. Find VCs in Bangalore, Mumbai, Delhi, and other startup hubs.',
  keywords: 'venture capital india, VC list india, angel investors india, startup funding, venture capital firms, bangalore VCs, mumbai angel investors, delhi venture capital, startup investment, seed funding india',
  openGraph: {
    title: 'Complete VC List India 2024 | 500+ Venture Capital Firms & Angel Investors',
    description: 'Connect with venture capital firms in India. Complete VC directory with investment criteria and contact details.',
    url: 'https://startup911.in/vcs',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Complete VC List India 2024 | 500+ Venture Capital Firms & Angel Investors',
    description: 'Connect with venture capital firms in India. Complete VC directory with investment criteria and contact details.',
  },
  alternates: {
    canonical: 'https://startup911.in/vcs',
  },
};

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

  // Render our wizard component and pass it the data
  return <VCQuestionnaire groupedTags={groupedTags} />;
} 