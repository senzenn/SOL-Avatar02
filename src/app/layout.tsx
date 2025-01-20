import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AvatarProvider } from '@/hooks/useAvatar';


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sol Avatar",
  description: "Solana Avatar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AvatarProvider>
          {children}
        </AvatarProvider>
      </body>
    </html>
  );
}
