'use client'
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    window.location.href = '/home';
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10 sm:p-10 md:p-24 lg:p-32 font"
      style={{ fontFamily: 'Anton, sans-serif' }}>
    </main>
  );
}



