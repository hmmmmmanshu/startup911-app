// lib/types.ts

// Defines the shape of a single Tag object
export type Tag = {
  id: number;
  name: string;
  type: string;
};

// Defines the shape of a Grant, including its associated tags
export type Grant = {
  id: number;
  name: string;
  organization: string | null;
  details: string | null;
  status: string | null;
  amount_max: string | null;
  dpiit_required: boolean | null;
  tech_focus_required: boolean | null;
  patent_required: boolean | null;
  prototype_required: boolean | null;
  technical_cofounder_required: boolean | null;
  full_time_commitment: boolean | null;
  women_led_focus: boolean | null;
  student_focus: boolean | null;
  application_deadline: string | null;
  application_link: string | null;
  mentorship_included: boolean | null;
  workspace_provided: boolean | null;
  network_access: boolean | null;
  created_at: string;
  // Optional property for when we join with grant_tags
  grant_tags?: Array<{
    tags: {
      id: number;
      name: string;
      type: string;
    };
  }>;
};

// Extended Grant type with scoring information
export interface GrantWithScore extends Grant {
  matchScore: number;
  matchingTags?: Tag[];
  tier?: number;
  tierLabel?: string;
  matchReasons?: string[];
}

// Simple scored grant type for results page
export type ScoredGrant = Grant & {
  matchScore: number;
};

// Defines the shape of a VC, including its associated tags
export type VC = {
  id: number;
  name: string;
  website: string | null;
  linkedin: string | null;
  country_based_of: string | null;
  about: string | null;
  key_person: string | null;
  created_at: string;
};

// Extended VC type with scoring information
export interface VCWithScore extends VC {
  matchScore: number;
  matchingTags: Tag[];
  tier: number;
  tierLabel: string;
  matchReasons: string[];
}

// Defines the shape of a Mentor
export type Mentor = {
  id: string; // UUID is a string
  name: string;
  photo_url: string;
  superpower: string;
  about: string;
  languages: string[];
  rate_tier: string;
  linkedin_url: string;
  calendly_url: string;
  created_at: string;
}; 