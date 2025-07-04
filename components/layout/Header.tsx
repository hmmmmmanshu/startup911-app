import Link from 'next/link';
import Image from 'next/image';

// Corrected Header with visual separation for the dark theme
export default function Header() {
  return (
    <header className="bg-[#121212] sticky top-0 z-50 border-b border-white/10">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          {/* Real SVG Logo */}
          <Image
            src="/logo.svg"
            alt="startup911.in logo"
            width={32}
            height={32}
          />
          <span className="text-xl font-semibold text-white">
            startup911.in
          </span>
        </Link>
        <div className="hidden md:flex items-center space-x-1">
          <Link href="/blog" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-300">
            Blogs
          </Link>
          <div className="w-px h-6 bg-white/20 mx-2"></div>
          <Link href="https.snap-grant-launchpad.lovable.app/" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-300">
            Grant Snap
          </Link>
        </div>
      </nav>
    </header>
  );
}