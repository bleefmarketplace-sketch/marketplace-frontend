
import { DashboardLayout } from "@/components/AdminComponents/DashboardLayout2";


 

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
