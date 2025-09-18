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
          Find startup grants in India, venture capital firms, and mentors without friction. Your complete guide to Indian startup ecosystem funding.
        </p>

        <div className="container mx-auto max-w-5xl mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <ChoiceCard href="/grants" title="Startup Grants India" description="Find Government Grants, NIDHI Funding & Startup India Schemes" icon={<Briefcase size={36} />} />
          <ChoiceCard href="/mentors" title="Industry Mentors" description="Get guidance from experienced startup mentors in India" icon={<Handshake size={36} />} />
          <ChoiceCard href="/vcs" title="Venture Capital India" description="Connect with 500+ VCs, Angel Investors & Debt Funding" icon={<Brain size={36} />} />
        </div>
      </section>

      {/* Startup Grants Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Top Startup Grants in India 2024
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Access 100+ government and private funding schemes for Indian startups. From <Link href="/grants" className="text-green-400 hover:text-green-300">NIDHI seed funding</Link> to <Link href="/grants" className="text-green-400 hover:text-green-300">Startup India schemes</Link>, find the perfect grant for your startup stage and industry. Browse our <Link href="/faq" className="text-green-400 hover:text-green-300">funding FAQ</Link> for detailed guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-[#1C1C1E] p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-3">Government Startup Grants</h3>
              <p className="text-gray-400 mb-4">NIDHI-SSP, Startup India Seed Fund, BIRAC grants, and other government funding schemes.</p>
              <span className="text-green-400 font-semibold">₹50,000 - ₹50 Lakhs</span>
            </div>
            
            <div className="bg-[#1C1C1E] p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-3">Private Foundation Grants</h3>
              <p className="text-gray-400 mb-4">Corporate CSR grants, foundation funding, and private sector startup support programs.</p>
              <span className="text-green-400 font-semibold">₹1 Lakh - ₹25 Lakhs</span>
            </div>
            
            <div className="bg-[#1C1C1E] p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-3">State Government Schemes</h3>
              <p className="text-gray-400 mb-4">Karnataka Startup Cell, Maharashtra startup grants, and other state-specific funding.</p>
              <span className="text-green-400 font-semibold">₹25,000 - ₹10 Lakhs</span>
            </div>
          </div>

          <div className="text-center">
            <Link href="/grants" className="inline-block px-8 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
              Explore All Grants
            </Link>
          </div>
        </div>
      </section>

      {/* VC Directory Section */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Venture Capital Firms in India
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Connect with 500+ active VCs and angel investors across India. Our curated database includes investment criteria, portfolio companies, and contact details for top funding sources. Explore <Link href="/vcs" className="text-blue-400 hover:text-blue-300">Bangalore VCs</Link>, <Link href="/vcs" className="text-blue-400 hover:text-blue-300">Mumbai angel investors</Link>, and <Link href="/vcs" className="text-blue-400 hover:text-blue-300">Delhi venture capital</Link> firms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-[#1C1C1E] p-8 rounded-xl border border-gray-800">
              <h3 className="text-2xl font-bold text-white mb-4">Bangalore VC Ecosystem</h3>
              <p className="text-gray-400 mb-6">Access top VCs like Accel Partners, Blume Ventures, and Sequoia Capital India investing in tech startups.</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Seed Stage</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Series A</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Growth Stage</span>
              </div>
            </div>
            
            <div className="bg-[#1C1C1E] p-8 rounded-xl border border-gray-800">
              <h3 className="text-2xl font-bold text-white mb-4">Mumbai Angel Network</h3>
              <p className="text-gray-400 mb-6">Connect with angel investors and early-stage VCs in Mumbai's thriving startup ecosystem.</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">Angel Funding</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">Pre-Seed</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">Seed Round</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/vcs" className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
              Browse VC Directory
            </Link>
          </div>
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
