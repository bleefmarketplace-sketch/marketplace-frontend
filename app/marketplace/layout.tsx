import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bleefy Marketplace | Buy Farm Fresh Grains & Crops",
  description: "Secure wholesale orders of sweet white yams, dry yellow maize, sorghum seeds, and fertilizers directly from certified Nigerian estates with 100% escrow protection.",
  keywords: ["wholesale yams lagos", "buy maize in bulk nigeria", "escrow agricultural trade", "grain silos suppliers", "nigeria farm produce"],
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
