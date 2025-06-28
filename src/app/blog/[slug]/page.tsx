import { createClient } from '../../../../utils/supabase/server';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// This is the corrected function signature that solves the build error
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await the params since they're now a Promise in Next.js 15
  const { slug } = await params;
  
  const supabase = await createClient();

  // Fetch the single post from the database
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  // If no post is found for the given slug, show a 404 page
  if (error || !post) {
    notFound();
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

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Back to Blog Link */}
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-gray-400 hover:text-green-400 transition-colors duration-300 text-sm font-medium group"
          >
            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blogs
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          {/* Published Date */}
          <div className="flex items-center gap-3 mb-6">
            <p className="text-gray-500 text-sm font-medium">
              {formatDate(post.published_at)}
            </p>
            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
            <span className="text-gray-500 text-sm">
              Article
            </span>
          </div>

          {/* Post Title */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white mb-4">
            {post.title}
          </h1>
          
          {/* Decorative line */}
          <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-green-400 rounded-full"></div>
        </header>

        {/* Article Content */}
        <article className="bg-gray-900/50 rounded-2xl p-8 md:p-12 border border-gray-800/50">
          <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-headings:font-bold prose-p:text-gray-300 prose-p:leading-relaxed prose-strong:text-white prose-code:text-green-400 prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-blockquote:border-l-green-500 prose-blockquote:bg-gray-800/50 prose-blockquote:pl-6 prose-blockquote:py-2 prose-a:text-green-400 prose-a:no-underline hover:prose-a:text-green-300">
            <ReactMarkdown>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Footer Navigation */}
        <footer className="mt-16 pt-8 border-t border-gray-800/50">
          <div className="flex items-center justify-between">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-gray-400 hover:text-green-400 transition-colors duration-300 group"
            >
              <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to all blogs
            </Link>
            
            <div className="text-gray-500 text-sm">
              Published on {formatDate(post.published_at)}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
} 