
import { DashboardLayout } from "@/components/AdminComponents/DashboardLayout";


 

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
