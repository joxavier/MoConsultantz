'use client'
import Image from "next/image";
import Header from '../components/Header';
import UnderConstructionPage from '../components/UnderConstructionPage';


export default function Vestmentz() {



  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10 sm:p-10 md:p-24 lg:p-32 font"
      style={{ fontFamily: 'Anton, sans-serif' }}>
      <Header />

      <div style={{ maxWidth: '1320px' }}>
        <UnderConstructionPage redirectLink="https://sites.google.com/view/modevz/movesmentz" />
      </div>
    </main>
  );
}
