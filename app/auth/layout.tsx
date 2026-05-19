import type { Metadata } from "next";

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
  return <>{children}</>;
}
