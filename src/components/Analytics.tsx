'use client'

import Script from 'next/script'

export default function Analytics() {
  return (
    <>
      {/* Google Analytics - Load after page is interactive */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-B1HRJP8WQP"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-B1HRJP8WQP');
        `}
      </Script>

      {/* Microsoft Clarity - Load after page is interactive */}
      <Script id="microsoft-clarity" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "tdl1co8yzx");
        `}
      </Script>
    </>
  )
}
