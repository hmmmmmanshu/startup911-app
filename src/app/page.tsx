import Link from 'next/link';
import { Briefcase, Brain, Handshake, Rocket } from 'lucide-react';

// Reusable Card for the main choices
const ChoiceCard = ({ href, title, description, icon }: { href: string; title: string; description: string; icon: React.ReactNode }) => {
  return (
    <Link href={href} className="block group h-full">
      <div className="p-8 h-full bg-[#1C1C1E] rounded-2xl border border-gray-800 flex flex-col justify-between text-center transform transition-all duration-300 hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1">
        <div className="flex-grow flex flex-col justify-center items-center">
          <div className="text-green-400 mb-4">{icon}</div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="mt-2 text-gray-400 text-base">{description}</p>
        </div>
      </div>
    </Link>
  );
};

// The new Homepage with a professional overhaul
export default function HomePage() {
  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-[#121212]">
        <h1 className="text-5xl md:text-7xl font-bold text-white">
          <span className="inline-block hover:scale-110 transition-transform duration-300 cursor-default">
            Startup911
          </span>
        </h1>
        <p className="mt-6 text-lg text-gray-400 max-w-2xl">
          Find grants, VCs, and mentors without friction.
        </p>

        <div className="container mx-auto max-w-5xl mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <ChoiceCard href="/grants" title="I need Grants" description="Find Grants, Fellowships & Incubators" icon={<Briefcase size={36} />} />
          <ChoiceCard href="/mentors" title="I need Mentors" description="Get guidance from industry experts" icon={<Handshake size={36} />} />
          <ChoiceCard href="/vcs" title="I need VCs" description="Find Venture Capital & Debt Funding" icon={<Brain size={36} />} />
        </div>
      </section>

      {/* Grant Snap Feature Section */}
      <section id="grant-snap" className="py-20 bg-[#121212]">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <div className="mb-4 inline-flex items-center justify-center px-4 py-1 text-sm font-semibold text-green-300 bg-green-500/10 rounded-full">
            <Rocket className="w-4 h-4 mr-2" /> Our Flagship Product
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Supercharge Your Grant Applications with Grant Snap
          </h2>
          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
            Stop wasting hours filling out the same information on endless grant forms. Our browser extension automates the tedious work so you can focus on what matters most: building your company.
          </p>
          <div className="mt-8">
            <a 
              href="https://www.grantsnap.pro/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-green-600 text-white font-bold rounded-lg shadow-lg shadow-green-500/40 hover:bg-green-700 hover:scale-105 transform transition-all duration-300"
            >
              Learn More & Get Started
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
