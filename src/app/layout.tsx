import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleTagManager } from '@next/third-parties/google'
import "./globals.css";
import { Providers } from './providers'

const anton = "https://fonts.googleapis.com/css2?family=Anton&display=swap";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mo | Where Small Business Happens",
  description: "MoConsultantz | MoVestmentz | MoDevz",
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
      <GoogleTagManager gtmId="G-BSBPSM99P8" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
