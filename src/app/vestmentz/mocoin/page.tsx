'use client'
import Countdown from './countdown';
import Header from '../../components/Header';
import { useTheme } from 'next-themes';
import PreSaleInstructions from './presale';
import pageData from '../../../data/moCoinPage.json';
import Hero from '../../consultantz/Hero';


export default function Mocoin() {
  const chartLink = 'https://www.dextools.io/app/en/solana/pair-explorer/2mz5eNLTpCk2F6CvP1y9LWdUe6LUh1zqPa7bzPFYWns8?t=1711224539477'
  let darkModeActive = useTheme().theme === 'dark';
  const { hero } = pageData;
  return (

    <main className="flex min-h-screen flex-col items-center justify-between p-10 pt-32 sm:p-10 md:p-24 lg:p-32 font"
      style={{ fontFamily: 'Anton, sans-serif' }}>
      <Header />

      <div className={`p-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8`}
        style={{ transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out', margin: '20px 0', width: "100%", maxWidth: '1320px' }}>
        <div className="col-span-1 lg:col-span-1">
          <Hero {...hero} />
        </div>
        <span className={`bg-clip-text text-transparent text-center text-2xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl bg-gradient-to-b from-[#3ca5de] to-[#8743f7]`}>
          Official Token of the Mo Ecosystem.
        </span>
      </div>

      <div className="max-w-50 flex justify-center items-center flex-col">
        <h1>
          <span className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl ">Initial Coin Offering in ...</span>
        </h1>
        <Countdown countdownDate={new Date('April 20, 2024 04:20:24 EST').getTime()} />
      </div>

      <div className="text-center p-4 flex flex-col items-center">
        <PreSaleInstructions />

        <button
          onClick={() => window.location.href = chartLink}
          className={`mt-8 px-8 py-4 rounded-full transition-all transform ${darkModeActive ? 'border-white border-2 bg-black text-white hover:bg-white hover:text-black' : 'bg-black text-white hover:bg-white hover:text-black'}`}
        >
          {'Chart'}
        </button>
      </div>
    </main >
  );
}
