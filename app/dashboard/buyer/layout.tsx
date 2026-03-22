

import { BuyerProvider } from "@/context/BuyerContext";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

 

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <BuyerProvider >
      <Suspense fallback={
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-emerald-600" />
        </div>
      }>  
      {children}
      </Suspense>
    </BuyerProvider>
  );
}
