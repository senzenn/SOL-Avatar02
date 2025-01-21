import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AvatarProvider } from '@/hooks/useAvatar';
import Navbar from "@/components/Navbar";
import ShaderBackground from '@/components/ShaderBackground';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sol Avatar",
  description: "Next generation avatar platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ShaderBackground />
        <AvatarProvider>
          <Navbar />
          {children}
        </AvatarProvider>
      </body>
    </html>
  );
}
