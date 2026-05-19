import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bleefy Farm Community | Exchange Agro Insights",
  description: "Connect with certified agronomists, ask farming questions, share harvest reports, and collaborate with thousands of growers in Nigeria's leading agriculture community.",
  keywords: ["nigeria farmers forum", "agronomist online community", "farming advice group", "agricultural trade discussions"],
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
