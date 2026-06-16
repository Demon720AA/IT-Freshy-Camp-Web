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
      <body className={`${inter.className} antialiased bg-slate-100`}>
        <div className="mx-auto max-w-md min-h-screen relative overflow-x-hidden shadow-[0_0_100px_rgba(0,0,0,0.1)]">
          {children}
        </div>
      </body>
    </html>
  );
}
