import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Loader from "./components/loader/Loader";
import { AuthProvider } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Panto — Minimalist & Modern Architectural Furniture",
  description: "Discover handcrafted luxury furniture engineered for permanent comfort and minimalist modern living. Created by Md. Mehedi Hasan.",
  keywords: ["furniture", "luxury furniture", "chairs", "sofas", "interior design", "Panto"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#FBFBFB] text-[#0D1B2A] selection:bg-[#E58A44] selection:text-white`}
      >
        <AuthProvider>
          <Loader>{children}</Loader>
        </AuthProvider>
      </body>
    </html>
  );
}
