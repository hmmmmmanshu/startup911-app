import { createClient } from '../../../utils/supabase/server'
import IncubationCentresClient from './IncubationCentresClient'

// Define the type for incubation centre data
export interface IncubationCentre {
  id: string
  name: string
  state: string | null
  email: string | null
  created_at: string
}

// Server component that fetches data and passes to client component
export default async function IncubationCentresPage() {
  const supabase = await createClient()
  
  // Fetch all incubation centres, ordered alphabetically by name
  const { data: centres, error } = await supabase
    .from('incubation_centres')
    .select('id, name, state, email, created_at')
    .order('name', { ascending: true })

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Incubation Centres</h1>
          <p className="text-gray-400">Please try again later.</p>
        </div>
      </div>
    )
  }

  // Return the client component with the data
  return <IncubationCentresClient centres={centres || []} />
} 