import { createClient } from '../../../utils/supabase/server';
import VCQuestionnaire from '../../../components/feature/VCQuestionnaire';
import Link from 'next/link';

// Helper function to categorize VC tags based on tag names
const categorizeVCTags = (tags: any[]) => {
  const fundingStages = [
    'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series C+', 
    'Pre-Series A', 'Angel', 'Debt Financing', 'Post-IPO Debt', 'Post-IPO Equity', 'Grant'
  ];

  const industries = [
    'Finance', 'Health Care', 'Consumer', 'Enterprise', 'Bio Tech', 'Web3', 
    'Education', 'E-commerce', 'B2B', 'Artificial Intelligence', 'Real Estate',
    'Media and Entertainment', 'Social Media', 'Information Technology', 'Software',
    'SaaS', 'Logistics', 'Food and Beverage', 'Insurance', 'Climate Tech',
    'Agriculture', 'Blockchain', 'Sustainability', 'Banking', 'Robotics',
    'Telecommunications', 'Payments', 'Marketplace', 'Mobile', 'Transportation',
    'Deep tech', 'Medical', 'Medical Device', 'Renewable Energy'
  ];

  const categories: { [key: string]: any[] } = {
    STAGE: [],
    INDUSTRY: [],
    INVESTMENT_TYPE: []
  };

  tags.forEach(tag => {
    if (fundingStages.includes(tag.name)) {
      categories.STAGE.push(tag);
    } else if (industries.includes(tag.name)) {
      categories.INDUSTRY.push(tag);
    } else if (['Impact Investing', 'Social Impact', 'Sector Agnostic'].includes(tag.name)) {
      categories.INVESTMENT_TYPE.push(tag);
    }
  });

  return categories;
};

// This is an async Server Component that fetches data from Supabase
export default async function VCsPage() {
  const supabase = await createClient();
  
  // First get all VC tag IDs
  const { data: vcTagIds } = await supabase
    .from('vc_tags')
    .select('tag_id');
  
  const tagIds = vcTagIds?.map(row => row.tag_id) || [];
  
  // Fetch VC tags and countries in parallel
  const [tagsResult, countriesResult] = await Promise.all([
    supabase
      .from('tags')
      .select('id, name')
      .in('id', tagIds),
    supabase
      .from('vcs')
      .select('country_based_of')
      .not('country_based_of', 'is', null)
  ]);

  if (tagsResult.error || !tagsResult.data) {
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

  // Categorize tags and prepare countries
  const groupedTags = categorizeVCTags(tagsResult.data);
  
  // Create geographical regions based on countries in database
  if (countriesResult.data) {
    const uniqueCountries = [...new Set(countriesResult.data.map(row => row.country_based_of))]
      .filter(Boolean);
    
    // Define geographical regions with their countries
    const geographicalRegions = [
      {
        id: 'southeast_asia',
        name: 'Southeast Asia',
        countries: ['Singapore', 'Indonesia', 'Vietnam', 'Malaysia', 'Thailand', 'Philippines', 'Cambodia', 'Myanmar', 'Republic of the Union of Myanmar']
      },
      {
        id: 'east_asia',
        name: 'East Asia',
        countries: ['China', 'Hong Kong', 'Japan', 'South Korea', 'Taiwan']
      },
      {
        id: 'south_asia',
        name: 'South Asia',
        countries: ['India', 'Pakistan', 'Bangladesh', 'Maldives']
      },
      {
        id: 'oceania',
        name: 'Australia & Oceania',
        countries: ['Australia']
      },
      {
        id: 'north_america',
        name: 'North America',
        countries: ['United States', 'Canada']
      },
      {
        id: 'europe',
        name: 'Europe',
        countries: ['United Kingdom', 'Germany', 'France', 'Italy', 'Switzerland', 'Netherlands', 'Czechia', 'Luxembourg', 'Cyprus', 'Romania', 'Malta', 'Sweden', 'Poland']
      },
      {
        id: 'middle_east',
        name: 'Middle East',
        countries: ['United Arab Emirates', 'Saudi Arabia', 'Turkey', 'Israel']
      },
      {
        id: 'latin_america',
        name: 'Latin America',
        countries: ['Brazil', 'Peru', 'Argentina']
      },
      {
        id: 'africa',
        name: 'Africa',
        countries: ['Morocco', 'Ghana']
      },
      {
        id: 'caribbean',
        name: 'Caribbean & Offshore',
        countries: ['Cayman Islands']
      }
    ];

    // Only include regions that have countries present in our database
    groupedTags.LOCATION = geographicalRegions
      .filter(region => region.countries.some(country => uniqueCountries.includes(country)))
      .map(region => {
        // Count VCs in this region
        const regionCountries = region.countries.filter(country => uniqueCountries.includes(country));
        const vcCount = countriesResult.data
          .filter(row => regionCountries.includes(row.country_based_of))
          .length;
        
        return {
          id: region.id,
          name: `${region.name} (${vcCount} VCs)`,
          type: 'LOCATION',
          countries: regionCountries
        };
      });
  }

  // Render the VCQuestionnaire component with the fetched data
  return <VCQuestionnaire groupedTags={groupedTags} />;
} 