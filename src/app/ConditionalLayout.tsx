"use client";

import { usePathname } from 'next/navigation';
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isExtensionPage = pathname === '/extension';

  if (isExtensionPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
} 