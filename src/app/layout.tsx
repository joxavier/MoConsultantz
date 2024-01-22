import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const anton = "https://fonts.googleapis.com/css2?family=Anton&display=swap";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mo | Joshua Xavier",
  description: "Joshua Xavier's (Joxavier@MoConsultantz.com) personal page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href={anton} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
