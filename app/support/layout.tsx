import type { Metadata } from "next";
import React from "react";
import LandingPagesNav from "@/components/LandingPagesNav";
import Footer from "@/components/Marketplace/Footer";

export const metadata: Metadata = {
  title: "Bleefy Helpdesk | Customer Support & Escrow Assistance",
  description: "Get immediate help with crop logistics, secure escrow disputes resolution, account setups, or payments on Nigeria's trusted agricultural hub.",
  keywords: ["bleefy help center", "farm delivery support", "payment gateway assistance", "dispute resolution"],
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <LandingPagesNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
