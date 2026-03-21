

import { BuyerProvider } from "@/context/BuyerContext";

 

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <BuyerProvider >
      {children}
    </BuyerProvider>
  );
}
