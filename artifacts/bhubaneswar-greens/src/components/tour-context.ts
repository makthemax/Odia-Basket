import { createContext, useContext } from "react";

export const TourContext = createContext<{ show: () => void } | null>(null);

export function useTourTrigger() {
  const ctx = useContext(TourContext);
  return ctx?.show ?? (() => {});
}
