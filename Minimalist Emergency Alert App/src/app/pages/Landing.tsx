import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Radio } from "lucide-react";

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center px-8 py-12 md:py-24 relative overflow-hidden">
      {/* Background depth layering */}
      <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-white/[0.015] to-transparent pointer-events-none" />

      <div className="flex w-full max-w-4xl flex-col items-center text-center z-10 flex-1 justify-center">
        <div className="relative mb-16 md:mb-24 flex h-40 w-40 md:h-56 md:w-56 items-center justify-center">
          {/* Refined Smooth Radar Waves */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border border-white/[0.04] bg-white/[0.005]"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: [0, 0.8, 0], scale: [0.3, 1.8, 3.5] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: i * 2,
                ease: [0.25, 1, 0.5, 1], // ease-out-quart
              }}
            />
          ))}
          {/* Central Elevated Icon */}
          <div className="relative z-10 flex h-20 w-20 md:h-28 md:w-28 items-center justify-center rounded-full bg-gradient-to-b from-[#1E1E1E] to-[#121212] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]">
             <Radio className="h-7 w-7 md:h-10 md:w-10 text-[#EAEAEA] drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]" strokeWidth={1.5} />
          </div>
        </div>

        <motion.h1 
          className="mb-4 md:mb-6 text-3xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-[#EAEAEA]"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Instant Emergency Alert
        </motion.h1>
        <motion.p 
          className="mb-16 md:mb-24 text-[17px] md:text-[21px] leading-relaxed text-[#A1A1AA] font-normal max-w-xl px-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          Send your location in seconds. Precision and reliability when it matters most.
        </motion.p>
        
        <motion.div 
          className="w-full max-w-sm flex flex-col items-center gap-8 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[11px] md:text-[13px] font-medium uppercase tracking-[0.2em] text-[#666666]">
            Fast. Simple. Reliable.
          </p>
          <motion.button
            onClick={() => navigate("/signup")}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="w-full rounded-2xl md:rounded-[20px] bg-gradient-to-b from-[#EAEAEA] to-[#D4D4D4] px-6 py-5 md:py-6 text-center text-[17px] md:text-[19px] font-semibold text-[#0A0A0C] shadow-[0_4px_24px_rgba(234,234,234,0.1)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(234,234,234,0.15)] hover:bg-[#F5F5F5]"
          >
            Get Started
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
