import { supabase } from './client'

export interface Tag {
  id: number
  name: string
  type: string | null
  created_at: string
}

export interface Grant {
  id: number
  name: string
  organization: string | null
  details: string | null
  status: string | null
  amount_max: string | null
  dpiit_required: boolean | null
  tech_focus_required: boolean | null
  patent_required: boolean | null
  prototype_required: boolean | null
  technical_cofounder_required: boolean | null
  full_time_commitment: boolean | null
  women_led_focus: boolean | null
  student_focus: boolean | null
  application_deadline: string | null
  application_link: string | null
  mentorship_included: boolean | null
  workspace_provided: boolean | null
  network_access: boolean | null
  created_at: string
}

export interface WaitlistEntry {
  id: string
  email: string
  source: string
  created_at: string
  updated_at: string
}

// Fetch all tags grouped by type
export async function fetchTagsGroupedByType() {
  const { data: tags, error } = await supabase
    .from('tags')
    .select('*')
    .not('type', 'is', null)
    .order('name')

  if (error) {
    console.error('Error fetching tags:', error)
    throw new Error('Failed to fetch tags')
  }

  // Group tags by type
  const groupedTags = {
    STAGE: [] as Tag[],
    INDUSTRY: [] as Tag[],
    REQUIREMENT: [] as Tag[],
    LOCATION: [] as Tag[],
    SOCIAL_IMPACT: [] as Tag[],
    SPECIAL_CATEGORY: [] as Tag[]
  }

  tags.forEach((tag) => {
    if (tag.type && groupedTags[tag.type as keyof typeof groupedTags]) {
      groupedTags[tag.type as keyof typeof groupedTags].push(tag)
    }
  })

  return groupedTags
}

// Fetch grants that match selected tag IDs
export async function fetchMatchingGrants(selectedTagIds: number[]) {
  if (selectedTagIds.length === 0) {
    return []
  }

  // Get grants that have at least one matching tag
  const { data: grantIds, error: tagsError } = await supabase
    .from('grant_tags')
    .select('grant_id')
    .in('tag_id', selectedTagIds)

  if (tagsError) {
    console.error('Error fetching grant tags:', tagsError)
    throw new Error('Failed to fetch matching grants')
  }

  // Extract unique grant IDs
  const uniqueGrantIds = [...new Set(grantIds.map(item => item.grant_id))]

  if (uniqueGrantIds.length === 0) {
    return []
  }

  // Fetch the actual grant details
  const { data: grants, error: grantsError } = await supabase
    .from('grants')
    .select('*')
    .in('id', uniqueGrantIds)

  if (grantsError) {
    console.error('Error fetching grants:', grantsError)
    throw new Error('Failed to fetch grant details')
  }

  return grants || []
}

// Add email to waitlist
export async function addToWaitlist(email: string, source: string = 'grant_snap_extension') {
  const { data, error } = await supabase
    .from('waitlist')
    .insert([
      {
        email: email.toLowerCase().trim(),
        source: source
      }
    ])
    .select()

  if (error) {
    // Check if it's a duplicate email error
    if (error.code === '23505') {
      throw new Error('This email is already on the waitlist')
    }
    console.error('Error adding to waitlist:', error)
    throw new Error('Failed to add email to waitlist')
  }

  return data?.[0] || null
}

// Get waitlist count (for admin purposes)
export async function getWaitlistCount() {
  const { count, error } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Error fetching waitlist count:', error)
    throw new Error('Failed to fetch waitlist count')
  }

  return count || 0
}

// Check if email exists in waitlist
export async function checkEmailInWaitlist(email: string) {
  const { data, error } = await supabase
    .from('waitlist')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking email in waitlist:', error)
    throw new Error('Failed to check email in waitlist')
  }

  return !!data
} 