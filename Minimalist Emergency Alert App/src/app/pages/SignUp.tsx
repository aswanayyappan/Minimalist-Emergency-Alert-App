import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

export function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex min-h-[100dvh] w-full flex-col px-6 pt-16 md:pt-0 relative items-center justify-center">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 md:mb-0 md:absolute md:top-12 md:left-12 px-2 z-20 self-start md:self-auto"
      >
        <button 
          onClick={() => navigate(-1)}
          className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-white/[0.02] text-[#A1A1AA] transition-all duration-300 hover:bg-white/[0.04] hover:text-[#EAEAEA] border border-white/[0.02]"
        >
          <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex flex-col justify-center max-w-[340px] md:max-w-[480px] pb-24 md:pb-0 z-10"
      >
        <div className="w-full rounded-[32px] md:rounded-[40px] border border-white/[0.03] bg-gradient-to-b from-[#141414] to-[#0E0E0E] p-8 md:p-12 shadow-[0_24px_64px_rgba(0,0,0,0.6)] relative overflow-hidden backdrop-blur-3xl">
          {/* Subtle top highlight */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          
          <h2 className="mb-8 md:mb-12 text-[28px] md:text-[36px] font-bold tracking-[-0.03em] text-[#EAEAEA]">
            Set Up Profile
          </h2>

          <form onSubmit={handleContinue} className="flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col gap-3 md:gap-4">
              <label className="text-[11px] md:text-[12px] font-medium uppercase tracking-[0.15em] text-[#888888]">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-2xl md:rounded-[20px] border border-white/[0.04] bg-[#0A0A0A]/50 px-6 py-5 md:py-6 text-[17px] md:text-[19px] text-[#EAEAEA] placeholder-[#555555] outline-none transition-all duration-300 focus:border-white/[0.12] focus:bg-[#0A0A0A] focus:shadow-[0_0_24px_rgba(255,255,255,0.02)]"
              />
            </div>

            <div className="flex flex-col gap-3 md:gap-4">
              <label className="text-[11px] md:text-[12px] font-medium uppercase tracking-[0.15em] text-[#888888]">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-2xl md:rounded-[20px] border border-white/[0.04] bg-[#0A0A0A]/50 px-6 py-5 md:py-6 text-[17px] md:text-[19px] text-[#EAEAEA] placeholder-[#555555] outline-none transition-all duration-300 focus:border-white/[0.12] focus:bg-[#0A0A0A] focus:shadow-[0_0_24px_rgba(255,255,255,0.02)]"
              />
            </div>

            <motion.button
              whileTap={!(!name || !phone) ? { scale: 0.96 } : undefined}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              disabled={!name || !phone}
              type="submit"
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl md:rounded-[20px] bg-gradient-to-b from-[#EAEAEA] to-[#D4D4D4] px-6 py-5 md:py-6 text-[17px] md:text-[19px] font-semibold text-[#0A0A0C] shadow-[0_4px_24px_rgba(234,234,234,0.1)] transition-all duration-300 disabled:opacity-30 disabled:shadow-none hover:shadow-[0_8px_32px_rgba(234,234,234,0.15)] hover:bg-[#F5F5F5]"
            >
              Continue
              <ArrowRight className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2} />
            </motion.button>
          </form>

          <p className="mt-8 md:mt-10 text-center text-[11px] md:text-[12px] font-medium uppercase tracking-[0.2em] text-[#555555]">
            Used only for sending alerts
          </p>
        </div>
      </motion.div>
    </div>
  );
}
