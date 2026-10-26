// UnderConstructionPage.tsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const UnderConstructionPage: React.FC<{ redirectLink: string }> = ({ redirectLink }) => {
  const [countdown, setCountdown] = useState(7);

  useEffect(() => {
    // Set a timer to navigate to the old site after 7 seconds
    const timer = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);

    // Redirect to the specified link after 7 seconds
    const navigationTimer = setTimeout(() => {
      window.location.href = redirectLink;
    }, 7000);

    // Clear the timers when the component is unmounted
    return () => {
      clearInterval(timer);
      clearTimeout(navigationTimer);
    };
  }, [redirectLink]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10 sm:p-10 md:p-24 lg:p-32 font"
      style={{ fontFamily: 'Anton, sans-serif' }}>

      <div style={{ maxWidth: '1320px' }}>
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <h1>Our New Page is Under Construction</h1>
          <p>
            <Link href={redirectLink}>
              Click HERE to Visit our old site.
            </Link>
          </p>
          <p>Redirecting to the old site in {countdown} seconds...</p>
        </div>
      </div>
    </main>
  );
};

export default UnderConstructionPage;
