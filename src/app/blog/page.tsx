import { createClient } from '../../../utils/supabase/server';
import Link from 'next/link';

// Define the interface for blog post data
interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
}

// Helper function to format date cleanly
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Helper function to get reading time estimate
const getReadingTime = (excerpt: string) => {
  const wordsPerMinute = 200;
  const words = excerpt.split(' ').length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

// Main blog page component with improved design
export default async function BlogPage() {
  const supabase = await createClient();

  // Fetch published posts from Supabase
  const { data: posts, error } = await supabase
    .from('posts')
    .select('title, slug, excerpt, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  // Handle error state
  if (error) {
    return (
      <div className="bg-black text-white min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Blogs
            </h1>
            <div className="w-16 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-8"></div>
            <p className="text-gray-400 text-lg">
              Unable to load articles. Please check back soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Enhanced Header */}
        <header className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Blogs
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Thoughts, insights, and stories about startups, technology, and building the future
          </p>
        </header>

        {/* Conditional Rendering */}
        {!posts || posts.length === 0 ? (
          // Enhanced Empty State
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-300">No articles yet</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              We&apos;re working on some amazing content. Check back soon for our latest insights and stories.
            </p>
          </div>
        ) : (
          // Enhanced Posts List
          <div className="space-y-0">
            {posts.map((post: BlogPost) => (
              <article key={post.slug} className="group">
                <Link
                  href={`/blog/${post.slug}`}
                  className="block py-10 border-b border-gray-800/50 last:border-b-0 transition-all duration-300 hover:bg-gray-900/20 hover:border-gray-700 rounded-lg hover:px-6 -mx-6"
                >
                  {/* Post Meta */}
                  <div className="flex items-center gap-3 mb-4">
                    <time className="text-gray-500 text-sm font-medium tracking-wide">
                      {formatDate(post.published_at)}
                    </time>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span className="text-gray-500 text-sm">
                      {getReadingTime(post.excerpt)}
                    </span>
                  </div>

                  {/* Post Title */}
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
                    {post.title}
                  </h2>

                  {/* Post Excerpt */}
                  <p className="text-gray-400 text-lg leading-relaxed line-clamp-3 group-hover:text-gray-300 transition-colors duration-300">
                    {post.excerpt}
                  </p>

                  {/* Read More Indicator */}
                  <div className="mt-6 flex items-center text-green-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-sm font-medium">Read article</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* Enhanced Footer */}
        {posts && posts.length > 0 && (
          <footer className="mt-20 pt-12 border-t border-gray-800/50 text-center">
            <div className="flex items-center justify-center gap-4 text-gray-500">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-gray-600"></div>
              <p className="text-sm">
                {posts.length} article{posts.length !== 1 ? 's' : ''} published
              </p>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-gray-600"></div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
} 