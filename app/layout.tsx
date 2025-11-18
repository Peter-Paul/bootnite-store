import type { Metadata } from "next";
import { Lilita_One } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

const lilitaOne = Lilita_One({
  weight: "400",
  variable: "--font-lilita",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Botnite Store",
  description: "Your one-stop shop for all things botnite",
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    other: {
      "fc:miniapp": JSON.stringify({
        version: "next",
        imageUrl:
          "https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761406429/Gemini_Generated_Image_roqu2wroqu2wroqu-removebg-preview_ktxto3.png",
        button: {
          title: `Open Bontnite Store`,
          action: {
            type: "launch_miniapp",
            name: "Botnite Store",
            url: "https://your-app.com",
            splashImageUrl: "https://your-app.com/splash-image",
            splashBackgroundColor: "#000000",
          },
        },
      }),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lilitaOne.variable} antialiased`}>{children}</body>
    </html>
  );
}
