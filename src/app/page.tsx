import Link from 'next/link';
import { Briefcase, Brain, Handshake } from 'lucide-react';

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
          Find startup grants in India, venture capital firms, and mentors without friction. Your complete guide to Indian startup ecosystem funding.
        </p>

        <div className="container mx-auto max-w-5xl mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <ChoiceCard href="/grants" title="I need Grants" description="Find Government Grants, NIDHI Funding & Startup India Schemes" icon={<Briefcase size={36} />} />
          <ChoiceCard href="/mentors" title="I need Mentors" description="Get guidance from experienced startup mentors in India" icon={<Handshake size={36} />} />
          <ChoiceCard href="/vcs" title="I need VCs" description="Connect with 500+ VCs, Angel Investors & Debt Funding" icon={<Brain size={36} />} />
        </div>
      </section>


    </div>
  );
}
