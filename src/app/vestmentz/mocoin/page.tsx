'use client'
import Countdown from './countdown';
import Header from '../../components/Header';
import { useTheme } from 'next-themes';
import PreSaleInstructions from './presale';
import pageData from '../../../data/moCoinPage.json';
import Hero from '../../consultantz/Hero';
import dynamic from 'next/dynamic';


export default function Mocoin() {
  const chartLink = 'https://www.dextools.io/app/en/solana/pair-explorer/2mz5eNLTpCk2F6CvP1y9LWdUe6LUh1zqPa7bzPFYWns8?t=1711224539477'
  let darkModeActive = useTheme().theme === 'dark';
  const { hero } = pageData;
  const TypewriterComponent = dynamic(() => import('typewriter-effect'), { ssr: false });

  const handleBookNowClick = () => {
    // Open Instagram link in a new tab
    //@ts-ignore
    window.open('https://raydium.io/swap/?inputCurrency=sol&outputCurrency=HHVmXazRvA3VdciVG4ayE7vjgUFUn12t5r7vYm2BJ258&fixed=in', '_blank');
  };
  return (


    <main className="flex min-h-screen flex-col items-center justify-between p-10 pt-32 sm:p-10 md:p-24 lg:p-32 font"
      style={{ fontFamily: 'Anton, sans-serif' }}>
      <Header />

      <div className={`p-5 grid grid-cols-1 minHeight-50vh sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8`}
        style={{ transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out', margin: '20px 0', width: "100%", minHeight: '50vh', maxWidth: '1320px' }}>
        <div className="col-span-1 lg:col-span-1">
          <Hero {...hero} />
        </div>
        <span className={`bg-clip-text text-transparent text-center text-2xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl bg-gradient-to-b from-[#3ca5de] to-[#8743f7]`}>
          Official Token of the Mo Ecosystem.
        </span>
      </div>

      <div style={{ padding: '20px', fontFamily: 'monospace', minHeight: '25vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0', marginBottom: '20px' }}>HOD·L</h1>
        <TypewriterComponent
          options={{
            strings: [
              "Crypto investors quickly retrofit HODL as an acronym for “hold on for dear life,",
              "An encouragement to other crypto investors not to sell when prices fall",
              "The word “HODL” originated from a post on the Bitcoin Forum",
              "The term HODL began as an accidental misspelling of 'hold'",
            ],
            autoStart: true,
            loop: true,
            delay: 70,
            deleteSpeed: 25,
          }}
        />
      </div>
      <button
        onClick={() => window.location.href = chartLink}
        className={`mt-8 px-8 py-4 rounded-full transition-all transform ${darkModeActive ? 'border-white border-2 bg-black text-white hover:bg-white hover:text-black' : 'bg-black text-white hover:bg-white hover:text-black'}`}
      >
        {'Chart'}
      </button>
      <button
        style={{
          backgroundColor: 'white',
          color: 'black',
          border: '2px solid white',
          padding: '10px 20px',
          borderRadius: '50px',
          cursor: 'pointer',
          fontSize: '24px',
          fontWeight: 'bold',
          transition: 'background-color 0.3s ease',
          margin: '20px', // Add margin to create space between the text and the button
        }}
        onClick={handleBookNowClick}
      >
        HODL NOW!
      </button>





      <div style={{ width: '100%', maxWidth: '1000px', margin: '40px 0' }}>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', background: '#000' }}>
          <iframe
            src="https://dexscreener.com/solana/2mz5eNLTpCk2F6CvP1y9LWdUe6LUh1zqPa7bzPFYWns8?embed=1&theme=dark&trades=0"
            frameBorder="0"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            allowFullScreen
          />
        </div>
      </div>

    

      <div className="mt-24 pt-25">

        <div className="max-w-50 flex justify-center items-center flex-col">
          <h1>
            <span className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl ">Initial Coin Offering in ...</span>
          </h1>
          <Countdown countdownDate={new Date('April 20, 2024 04:20:24 EST').getTime()} />
        </div>

        <div className="text-center p-4 flex flex-col items-center">
          <PreSaleInstructions />
        </div>
      </div>

    </main >
  );
}
