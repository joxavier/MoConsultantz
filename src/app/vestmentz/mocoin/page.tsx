'use client'
import Image from 'next/image';
import Countdown from './countdown';
import Header from '../../components/Header';
import { useTheme } from 'next-themes';
import PreSaleInstructions from './presale';
import pageData from '../../../data/moCoin.json';


export default function Mocoin() {

  const buyLink = 'https://raydium.io/swap/?inputCurrency=sol&outputCurrency=HHVmXazRvA3VdciVG4ayE7vjgUFUn12t5r7vYm2BJ258&outputSymbol=HHVmXa&fixed=in'
  const chartLink = 'https://www.dextools.io/app/en/solana/pair-explorer/2mz5eNLTpCk2F6CvP1y9LWdUe6LUh1zqPa7bzPFYWns8?t=1711224539477'

  let darkModeActive  = (String(useTheme()) === 'dark');
  console.log(useTheme().themes)

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    darkModeActive = true;
}


  return (

    <main className="flex min-h-screen flex-col items-center justify-between p-10 pt-32 sm:p-10 md:p-24 lg:p-32 font"
      style={{ fontFamily: 'Anton, sans-serif' }}>
      <Header />

      <div className={`p-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8`}
        style={{ transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out', margin: '20px 0', width: "100%", maxWidth: '1320px' }}>
        <div className="col-span-1 lg:col-span-1">
          <Image
            src={darkModeActive ? '/mo-dark.svg.png' : '/mo.svg'}
            alt={'MoCoin Logo'}
            className="rounded-xl hero-image"
            width='700'
            height='700'
          />
        </div>

        <div className="text-center  p-10 flex flex-col items-center">
          <h1 className="p-5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-black font-bold">
            <span className="text-shadow-black text-outline-black">{'MoCoin'}</span>
          </h1>
          <span className="bg-clip-text text-transparent text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl bg-gradient-to-b from-[#3ca5de] to-[#8743f7]">Official Token of the Mo Ecosystem.</span>



          <button
            onClick={() => window.location.href = buyLink}
            className="mt-8 px-8 py-4 bg-black text-white rounded-full transition-all hover:bg-white hover:text-black transform"
            disabled={true}
          >
            {'Swap Now!'}
          </button>

          <button
            onClick={() => window.location.href = chartLink}
            className="mt-8 px-8 py-4 bg-black text-white rounded-full transition-all hover:bg-white hover:text-black transform"

          >
            {'Chart'}
          </button>
        </div>
      </div>

      <div className="max-w-50 flex justify-center items-center flex-col">

        <h1>
          <span className="text-black text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl ">Going Public in ...</span>
        </h1>
        <Countdown countdownDate={new Date('April 10, 2024 00:00:00 EST').getTime()} />
      </div>

      <div>
        <PreSaleInstructions />
      </div>

    </main >

  );
}
