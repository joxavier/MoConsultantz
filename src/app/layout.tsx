import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleTagManager } from '@next/third-parties/google'
import "./globals.css";
import { Providers } from './providers'
import Header from './components/Header';
import Footer from "./components/Footer";

const anton = "https://fonts.googleapis.com/css2?family=Anton&display=swap";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mo | Where Small Business Happens",
  description: "MoConsultantz | MoVestmentz | MoDevz",
  robots: "index, follow",
  authors: [{ name: 'Josh', url: 'https://modevz.com/team/joxavier' }],
  creator: 'Joshua Xavier',
  publisher: 'Joshua Xavier',
  keywords: ['Consulting', 'Software Developer', 'Graphic Designer', 'E-Commerce'],
  generator: 'Next.js',
  applicationName: 'Next.js',
  metadataBase: new URL('https://modevz.ca'),
  alternates: {
    canonical: 'https://modevz.com',
    languages: {
      'en-US': '/en-US',
    }
    
  },
  openGraph: {
    images: '/mo.svg',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href={anton} />
      </head>
      <body className={inter.className}>
      <Header />
      <GoogleTagManager gtmId="G-BSBPSM99P8" />
        <Providers>
          {children}
        </Providers>
      <Footer />  
      </body>
    </html>
  );
}
