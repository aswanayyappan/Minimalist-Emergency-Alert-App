import { useEffect } from "react";
import { motion } from "motion/react";
import { Chrome } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export function SignUp() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || isAuthenticated) return null;
  const handleGoogleLogin = () => {
    // Redirect entirely to the backend for the login flow
    const BACKEND_URL = import.meta.env.VITE_API_URL?.replace("/alert", "") || "http://localhost:3000";
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return (
    <div className="flex min-h-[100dvh] w-full flex-col px-6 pt-16 md:pt-0 relative items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex flex-col justify-center max-w-[340px] md:max-w-[480px] pb-24 md:pb-0 z-10"
      >
        <div className="w-full rounded-[32px] md:rounded-[40px] border border-white/[0.03] bg-gradient-to-b from-[#141414] to-[#0E0E0E] p-8 md:p-12 shadow-[0_24px_64px_rgba(0,0,0,0.6)] relative overflow-hidden backdrop-blur-3xl">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          
          <h2 className="mb-4 text-[28px] md:text-[36px] font-bold tracking-[-0.03em] text-[#EAEAEA] text-center">
            Welcome
          </h2>
          <p className="mb-12 text-center text-[#888888] text-[15px] md:text-[17px]">
            Please sign in with Google to access the emergency dashboard.
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
            Secure Login via Google OAuth
          </p>
        </div>
      </motion.div>
    </div>
  );
}
