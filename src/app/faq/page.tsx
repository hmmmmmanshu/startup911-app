import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Startup Funding FAQ India | Grants, VCs & Investment Questions Answered',
  description: 'Get answers to common questions about startup funding in India. Learn about government grants, VC funding process, eligibility criteria, and application procedures for Indian entrepreneurs.',
  keywords: 'startup funding FAQ, how to get startup grant in india, VC funding process, government grants eligibility, startup funding questions, NIDHI grants FAQ, venture capital FAQ india',
  openGraph: {
    title: 'Startup Funding FAQ India | Grants, VCs & Investment Questions Answered',
    description: 'Get answers to common questions about startup funding in India.',
    url: 'https://startup911.in/faq',
    type: 'website',
  },
  alternates: {
    canonical: 'https://startup911.in/faq',
  },
};

const faqData = [
  {
    question: "How to get startup grant in India?",
    answer: "To get a startup grant in India, you need to: 1) Register your startup under Startup India initiative, 2) Identify suitable grants like NIDHI-SSP or BIRAC funding, 3) Prepare a detailed business plan, 4) Meet eligibility criteria (usually early-stage startups), 5) Submit application with required documents. Popular grants include government schemes and private foundation funding."
  },
  {
    question: "What are the best government grants for startups in India?",
    answer: "Top government grants for Indian startups include: NIDHI Seed Support Program (up to ₹50 lakhs), Startup India Seed Fund Scheme (up to ₹20 lakhs), BIRAC grants for biotech startups, DST-SERB grants for technology startups, and state-specific schemes like Karnataka Startup Cell grants. Each has different eligibility criteria and funding amounts."
  },
  {
    question: "How do I find VCs in India for my startup?",
    answer: "Find VCs in India through: 1) Our comprehensive VC directory with 500+ investors, 2) Startup events and pitch competitions, 3) Angel networks like Indian Angel Network, 4) City-specific ecosystems (Bangalore, Mumbai, Delhi), 5) Industry-specific VCs. Research their portfolio, investment stage, and ticket size before approaching."
  },
  {
    question: "What documents are needed for startup grant applications?",
    answer: "Essential documents for grant applications: Startup India registration certificate, incorporation documents, business plan with financial projections, founder resumes, product/service details, market analysis, use of funds statement, bank account details, and any relevant intellectual property documents."
  },
  {
    question: "How long does it take to get startup funding in India?",
    answer: "Funding timelines vary: Government grants typically take 3-6 months from application to disbursal. VC funding can take 6-12 months including due diligence. Angel funding is faster at 2-4 months. The process includes application review, presentations, due diligence, and legal documentation."
  },
  {
    question: "What are the eligibility criteria for NIDHI grants?",
    answer: "NIDHI grant eligibility: Startup should be incorporated within 10 years, have innovative technology-based solutions, demonstrate scalability potential, founders should have relevant experience, and the startup shouldn't have received funding exceeding ₹10 crores from government sources."
  },
  {
    question: "Best cities in India for startup funding?",
    answer: "Top cities for startup funding: Bangalore (highest VC concentration), Mumbai (financial capital with many investors), Delhi NCR (government proximity and diverse ecosystem), Pune (emerging tech hub), Hyderabad (IT and biotech focus), and Chennai (automotive and healthcare startups)."
  },
  {
    question: "How much equity do VCs typically ask for in India?",
    answer: "VC equity expectations in India: Seed stage VCs typically ask for 15-25% equity, Series A investors seek 20-30%, and later-stage investors may take 10-20%. The exact percentage depends on valuation, funding amount, and investor involvement level."
  }
];

export default function FAQPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Enhanced Header - matching blog style */}
        <header className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            FAQ
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-green-500 to-gray-500 mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Get answers to the most common questions about startup funding in India
          </p>
        </header>

        {/* FAQ Section - cleaner styling */}
        <div className="space-y-0">
          {faqData.map((faq, index) => (
            <article key={index} className="group">
              <div className="py-8 border-b border-gray-800/50 last:border-b-0 transition-all duration-300 hover:bg-gray-900/20 hover:border-gray-700 rounded-lg hover:px-6 -mx-6">
                <h2 className="text-xl md:text-2xl font-bold mb-4 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                  {faq.question}
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {faq.answer}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Call to Action - subdued colors */}
        <div className="mt-20 pt-12 border-t border-gray-800/50 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">
            Ready to Find Funding for Your Startup?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/grants" className="px-8 py-4 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-all duration-300 hover:scale-105">
              Explore Grants
            </Link>
            <Link href="/vcs" className="px-8 py-4 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-all duration-300 hover:scale-105">
              Browse VCs
            </Link>
            <Link href="/mentors" className="px-8 py-4 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-all duration-300 hover:scale-105">
              Find Mentors
            </Link>
          </div>
        </div>

        {/* Enhanced Footer */}
        <footer className="mt-20 pt-12 border-t border-gray-800/50 text-center">
          <div className="flex items-center justify-center gap-4 text-gray-500">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-gray-600"></div>
            <p className="text-sm">
              {faqData.length} question{faqData.length !== 1 ? 's' : ''} answered
            </p>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-gray-600"></div>
          </div>
        </footer>
      </div>
    </div>
  );
}
