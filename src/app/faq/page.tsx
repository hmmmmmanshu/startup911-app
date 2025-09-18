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
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Startup Funding FAQ
          </h1>
          <div className="w-24 h-1 bg-green-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Get answers to the most common questions about startup funding in India. Learn about grants, VCs, and the funding process.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="space-y-8">
          {faqData.map((faq, index) => (
            <div key={index} className="bg-[#1C1C1E] p-6 rounded-xl border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4">
                {faq.question}
              </h2>
              <p className="text-gray-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">
            Ready to Find Funding for Your Startup?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/grants" className="px-8 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
              Explore Grants
            </Link>
            <Link href="/vcs" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
              Browse VCs
            </Link>
            <Link href="/mentors" className="px-8 py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors">
              Find Mentors
            </Link>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-16 p-6 bg-[#1C1C1E] rounded-xl border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-4">Related Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-green-400 mb-2">Government Grants</h4>
              <ul className="space-y-1 text-gray-400">
                <li><Link href="/grants" className="hover:text-white">NIDHI Seed Support Program</Link></li>
                <li><Link href="/grants" className="hover:text-white">Startup India Seed Fund</Link></li>
                <li><Link href="/grants" className="hover:text-white">BIRAC Grants</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Venture Capital</h4>
              <ul className="space-y-1 text-gray-400">
                <li><Link href="/vcs" className="hover:text-white">Bangalore VC Directory</Link></li>
                <li><Link href="/vcs" className="hover:text-white">Mumbai Angel Investors</Link></li>
                <li><Link href="/vcs" className="hover:text-white">Delhi Venture Capital</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
