import { ReactNode } from "react";
import { Navbar } from "./navbar";
import { MobileNav } from "./mobile-nav";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { TourOverlay, useTour } from "@/components/tour-overlay";
import { TourContext } from "@/components/tour-context";

export function AppLayout({ children }: { children: ReactNode }) {
  const tour = useTour();
  return (
    <TourContext.Provider value={{ show: tour.show }}>
      <div className="relative flex min-h-screen flex-col bg-background pb-16 md:pb-0">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          {children}
        </main>
        <MobileNav />
        <WhatsAppFab />
        <TourOverlay open={tour.open} onClose={tour.close} />
      </div>
    </TourContext.Provider>
  );
}
