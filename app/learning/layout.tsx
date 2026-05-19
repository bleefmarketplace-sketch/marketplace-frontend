import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bleefy Academy | Master Agronomy & Agribusiness",
  description: "Learn precision agriculture, catfish breeding, and farming business strategy from certified Nigerian experts and university agronomists.",
  keywords: ["agric academy", "catfish farming course", "nigerian farming tutorial", "precision agriculture", "agribusiness course"],
};

export default function LearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
