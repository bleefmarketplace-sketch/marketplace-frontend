import { BuyerProvider } from "@/context/BuyerContext";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import LandingPagesNav from "@/components/LandingPagesNav";
import Footer from "@/components/Footer";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <BuyerProvider >
      <div className="min-h-screen bg-zinc-50/50 flex flex-col justify-between">
        <LandingPagesNav />
        <div className="flex-1">
          <Suspense fallback={
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-emerald-600" />
            </div>
          }>  
          {children}
          </Suspense>
        </div>
        <Footer />
      </div>
    </BuyerProvider>
  );
}
