import Link from 'next/link';

// Choice card component matching the homepage style
const GrantsChoiceCard = ({ href, title, description, icon }: { href: string; title: string; description: string; icon: React.ReactNode }) => {
  return (
    <Link 
      href={href} 
      className="block group h-full"
    >
      <div className="p-8 h-full bg-[#1C1C1E] rounded-2xl border border-gray-800 flex flex-col justify-between transform transition-all duration-300 hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-2">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="mt-2 text-gray-400">{description}</p>
        </div>
        <div className="mt-8 self-center">
          {icon}
        </div>
      </div>
    </Link>
  );
};

export default function GrantsLandingPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="min-h-[calc(100vh-69px)] flex flex-col items-center justify-center text-center p-4">
        
        {/* Back Button */}
        <div className="absolute top-8 left-8">
          <Link 
            href="/" 
            className="text-green-500 hover:text-green-400 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Title Section */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Funding & Support
        </h1>
        <div className="w-24 h-1 bg-green-500 mx-auto my-4"></div>
        <p className="text-gray-400 tracking-widest uppercase mb-8">
          Choose Your Path to Growth
        </p>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-16">
          Whether you're looking for grants and funding opportunities or seeking incubation support, we've got you covered.
        </p>

        {/* The Card Section */}
        <div className="container mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <GrantsChoiceCard 
            href="/grants/questionnaire"
            title="Grants Questionnaire"
            description="Find the perfect grants, fellowships, and funding opportunities tailored to your startup"
            icon={
              <div className="text-4xl">📋</div>
            }
          />
          <GrantsChoiceCard 
            href="/incubation-centres"
            title="Incubation Centre Finder"
            description="Discover incubation centres across India that can accelerate your startup journey"
            icon={
              <div className="text-4xl">🏢</div>
            }
          />
        </div>


      </div>
    </div>
  );
} 