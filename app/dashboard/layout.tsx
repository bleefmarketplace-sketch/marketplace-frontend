
import type { Metadata } from "next";
import { DashboardLayout } from "@/components/AdminComponents/DashboardLayout";

export const metadata: Metadata = {
  title: "Dashboard | Bleefy Agri Hub",
  robots: {
    index: false,
    follow: false,
  },
};


 

export default  function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <DashboardLayout >
      {children}
    </DashboardLayout>
  );
}
