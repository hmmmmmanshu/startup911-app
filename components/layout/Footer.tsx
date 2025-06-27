import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#121212] border-t border-white/10">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} startup911.in. All Rights Reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
        </div>
      </div>
    </footer>
  );
} 