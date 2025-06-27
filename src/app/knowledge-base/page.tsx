import { createClient } from '../../../utils/supabase/server'

// Define the type for knowledge base resource data
interface KnowledgeBaseResource {
  id: string
  title: string
  resource_type: string | null
  description: string | null
  category_tags: string[] | null
  link: string | null
  created_at: string
}

export default async function KnowledgeBasePage() {
  const supabase = await createClient()
  
  // Fetch all knowledge base resources, ordered alphabetically by title
  const { data: resources, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .order('title', { ascending: true })

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Knowledge Base</h1>
          <p className="text-gray-400">Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Founder's Knowledge Base
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A curated collection of essential resources, guides, and insights to help founders navigate their startup journey successfully.
          </p>
        </div>

        {/* Conditional Rendering */}
        {!resources || resources.length === 0 ? (
          // Empty State
          <div className="text-center py-20">
            <div className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-12 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4 text-gray-200">Coming Soon</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                We are busy curating the best resources for founders. This section will be updated soon!
              </p>
            </div>
          </div>
        ) : (
          // Data Display
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {resources.map((resource: KnowledgeBaseResource) => (
              <div
                key={resource.id}
                className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
              >
                {/* Resource Type Badge */}
                {resource.resource_type && (
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 text-xs font-medium rounded-full border border-blue-600/30">
                      {resource.resource_type}
                    </span>
                  </div>
                )}

                {/* Resource Title */}
                <h3 className="text-xl font-bold mb-3 text-white">
                  {resource.title}
                </h3>

                {/* Description */}
                {resource.description && (
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {resource.description}
                  </p>
                )}

                {/* Category Tags */}
                {resource.category_tags && resource.category_tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {resource.category_tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1 bg-green-600/20 text-green-400 text-xs font-medium rounded-full border border-green-600/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resource Link */}
                {resource.link && (
                  <div className="mt-auto pt-4">
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      View Resource
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        {resources && resources.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-400">
              Showing {resources.length} resource{resources.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 