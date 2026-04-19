import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowLeft, Chrome } from "lucide-react";
import { signInWithGoogle } from "../firebase";

export function SignUp() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      if (result.user) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Google login failed:", error);
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
          
          <h2 className="mb-4 text-[28px] md:text-[36px] font-bold tracking-[-0.03em] text-[#EAEAEA] text-center">
            Sign In
          </h2>
          <p className="mb-12 text-center text-[#888888] text-[15px] md:text-[17px]">
            Please sign in with Google to continue to Emergency Alert.
          </p>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-2xl md:rounded-[20px] bg-white/[0.05] border border-white/[0.1] px-6 py-6 md:py-8 text-[17px] md:text-[19px] font-semibold text-[#EAEAEA] transition-all duration-300 hover:bg-white/[0.08] hover:border-white/[0.2] active:bg-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          >
            <Chrome className="h-6 w-6 md:h-7 md:w-7" />
            Continue with Google
          </motion.button>

          <p className="mt-12 text-center text-[11px] md:text-[12px] font-medium uppercase tracking-[0.2em] text-[#555555]">
            Secure authentication by Firebase
          </p>
        </div>
      </motion.div>
    </div>
  );
}
