import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bleefy | Nigeria's #1 Agricultural Marketplace",
  description: "Buy farm-fresh produce directly from verified Nigerian farmers. Secure escrow payments, nationwide delivery, and expert agri-learning resources.",
  keywords: ["agriculture", "nigeria", "farming", "marketplace", "escrow", "agri-tech"],
  openGraph: {
    title: "Bleefy | Farm to Table, Secured.",
    description: "The most trusted agricultural marketplace in Nigeria.",
    url: "https://bleefyagri.com",
    siteName: "Bleefy",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_NG",
    type: "website",
  },
};

import { MobileBottomNav } from "@/components/MobileBottomNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600" />
          </div>}  >
          <AuthProvider>

            {children}
            <MobileBottomNav />
          </AuthProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Suspense>
      </body>
    </html>
  );
}
