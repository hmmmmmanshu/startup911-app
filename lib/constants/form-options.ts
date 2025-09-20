/**
 * Unified Form Options for Startup911
 * 
 * This file contains all the standardized options used across:
 * - Grant Questionnaire
 * - VC Questionnaire  
 * - Mentor Questionnaire
 * - Contribute Forms (Grant, VC, Mentor)
 * 
 * All options are synchronized with the database tags table.
 */

// Industry/Sector Options (INDUSTRY type in database)
export const INDUSTRY_OPTIONS = [
  'Technology & Software',
  'Finance & Fintech',
  'Healthcare & Biotech',
  'E-commerce & Retail',
  'Education & EdTech',
  'Energy & Sustainability',
  'Agriculture & Food',
  'Manufacturing',
  'Media & Entertainment',
  'Real Estate & PropTech',
  'Transportation & Logistics',
  'Gaming & Sports',
  'Travel & Tourism',
  'Social Impact',
  'DeepTech & AI',
  'Blockchain & Web3'
] as const;

// Startup Stage Options (STAGE type in database)
export const STARTUP_STAGE_OPTIONS = [
  'Idea Stage',
  'MVP/Prototype', 
  'Pre-Revenue',
  'Early Revenue',
  'Post-Revenue',
  'Pre-Seed',
  'Seed',
  'Series A',
  'Series B', 
  'Series C+',
  'Growth Stage',
  'Late Stage',
  'Bridge Rounds',
  'Secondary Markets',
  'All Stages'
] as const;

// Geographic Region Options (REGION type in database)
export const REGION_OPTIONS = [
  'India',
  'North America',
  'Europe',
  'Southeast Asia',
  'Middle East',
  'Africa',
  'South America',
  'Asia Pacific',
  'Global',
  'APAC',
  'EMEA',
  'Americas',
  'Tier 1 Cities',
  'Tier 2 Cities',
  'Rural Areas',
  'Metro Cities'
] as const;

// Functional Expertise Options (EXPERTISE type in database)
export const EXPERTISE_OPTIONS = [
  'Product Strategy',
  'Marketing & Growth',
  'Operations & Scaling',
  'Fundraising & Investment',
  'Legal & Compliance',
  'Sales & Business Development',
  'Human Resources & Talent',
  'Technology & Engineering',
  'Data & Analytics',
  'Design & UX',
  'Finance & Accounting',
  'Strategy & Planning',
  'International Expansion',
  'Partnerships & Alliances'
] as const;

// Language Options
export const LANGUAGE_OPTIONS = [
  'English',
  'Hindi', 
  'Bengali',
  'Marathi',
  'Telugu',
  'Tamil',
  'Gujarati',
  'Urdu',
  'Kannada',
  'Malayalam',
  'Punjabi'
] as const;

// Budget/Rate Tier Options
export const RATE_TIER_OPTIONS = [
  'Free',
  '<₹1K',
  '₹1K-3K',
  '₹3K-5K',
  '₹5K+'
] as const;

// Currency Options
export const CURRENCY_OPTIONS = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' }
] as const;

// VC-specific options that might differ slightly
export const VC_SECTOR_OPTIONS = [
  ...INDUSTRY_OPTIONS,
  'Sector Agnostic'  // VCs can be sector agnostic
] as const;

// Grant-specific stage groupings for questionnaire
export const GRANT_STAGE_GROUPS = {
  'Early Stage': ['Idea Stage', 'MVP/Prototype', 'Pre-Revenue'],
  'Revenue Stage': ['Early Revenue', 'Post-Revenue'],
  'Funding Rounds': ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+'],
  'Growth & Late': ['Growth Stage', 'Late Stage', 'Bridge Rounds']
} as const;

// Type definitions for better TypeScript support
export type IndustryOption = typeof INDUSTRY_OPTIONS[number];
export type StageOption = typeof STARTUP_STAGE_OPTIONS[number];
export type RegionOption = typeof REGION_OPTIONS[number];
export type ExpertiseOption = typeof EXPERTISE_OPTIONS[number];
export type LanguageOption = typeof LANGUAGE_OPTIONS[number];
export type RateTierOption = typeof RATE_TIER_OPTIONS[number];
export type CurrencyOption = typeof CURRENCY_OPTIONS[number];
