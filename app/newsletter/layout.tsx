import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bleefy Agri Insights Newsletter",
  description: "Manage your subscription to Bleefy's agricultural trends, silo dispatch logs, and seasonal crop market forecasts.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NewsletterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
