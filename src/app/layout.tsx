import type { Metadata } from "next";
import { Lilita_One } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import sdk from "@farcaster/miniapp-sdk";

const lilitaOne = Lilita_One({
  weight: "400",
  variable: "--font-lilita",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Botnite Store",
  description: "Your one-stop shop for all things botnite",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    sdk.actions.ready();
  }, []);
  return (
    <html lang="en">
      <body className={`${lilitaOne.variable} antialiased`}>{children}</body>
    </html>
  );
}
