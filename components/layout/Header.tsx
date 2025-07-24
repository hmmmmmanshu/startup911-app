import Link from 'next/link';
import Image from 'next/image';

// Corrected Header with visual separation for the dark theme
export default function Header() {
  return (
    <header className="bg-[#121212] sticky top-0 z-50 border-b border-white/10">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex flex-col items-start space-x-0">
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="Startup911 logo"
              width={32}
              height={32}
            />
            <span className="text-xl font-semibold text-white">
              Startup911
            </span>
          </div>
          <span className="text-xs text-gray-400 ml-11 -mt-1">Your Virtual CFO from Day 1</span>
        </Link>
        <div className="hidden md:flex items-center space-x-1">
          <Link href="/blog" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-300">
            Blogs
          </Link>
          <div className="w-px h-6 bg-white/20 mx-2"></div>
          <a
            href="https://www.grantsnap.pro/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-300"
          >
            Grant Snap
          </a>
        </div>
      </nav>
    </header>
  );
}