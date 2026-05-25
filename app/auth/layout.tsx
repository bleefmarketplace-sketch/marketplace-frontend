import type { Metadata } from "next";
import LandingPagesNav from "@/components/LandingPagesNav";
import Footer from "@/components/Marketplace/Footer";

export const metadata: Metadata = {
  title: "Secure Access | Bleefy Agri Hub",
  description: "Sign in or create your Bleefy account to access wholesale markets, certified training modules, and expert farm communities.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col antialiased">
      <LandingPagesNav />
      <div className="flex-1 flex flex-col justify-center items-center">
        {children}
      </div>
      <Footer />
    </div>
  );
}
