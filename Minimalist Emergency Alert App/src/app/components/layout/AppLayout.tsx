import { ReactNode } from "react";
import { GrainOverlay } from "./GrainOverlay";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#060606] text-[#EAEAEA] antialiased selection:bg-white/10 selection:text-white font-sans overflow-x-hidden">
      <GrainOverlay />
      <div className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
