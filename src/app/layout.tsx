import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Freshy Camp | Token Collection",
  description: "Collect tokens and compete in the freshman orientation event.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Freshy Camp",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-[#3244bb]`}>
        <div className="mx-auto max-w-md min-h-screen bg-[#3244bb] shadow-2xl shadow-black/20">
          {children}
        </div>
      </body>
    </html>
  );
}
