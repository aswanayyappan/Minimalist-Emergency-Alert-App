import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ShieldAlert, Ambulance, Flame, CheckCircle2, AlertTriangle, MapPin, Activity, LogOut } from "lucide-react";
import { clsx } from "clsx";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

type Status = "ready" | "fetching" | "sending" | "sent" | "error";
type ServiceType = "police" | "ambulance" | "fire" | null;

export function Dashboard() {
  const [status, setStatus] = useState<Status>("ready");
  const [activeService, setActiveService] = useState<ServiceType>(null);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, loading, logout } = useAuth();

  const BACKEND_URL = import.meta.env.VITE_API_URL?.replace("/alert", "") || "http://localhost:3000";

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/signup");
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const STATUS_URL = `${BACKEND_URL}/status`;
        const res = await fetch(STATUS_URL);
        if (res.ok) setIsOnline(true);
        else setIsOnline(false);
      } catch (e) {
        setIsOnline(false);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !isAuthenticated) return null;

  const handleLogout = async () => {
    console.log("Logout initiated");
    await logout();
    console.log("Logout complete, navigating...");
    navigate("/");
  };

  const handleAlert = async (service: ServiceType) => {
    if (status !== "ready" && status !== "sent" && status !== "error") return;
    
    setActiveService(service);
    setStatus("fetching");
    
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      setStatus("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setStatus("sending");

        try {
          const API_URL = `${BACKEND_URL}/alert`;
          const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: service?.toUpperCase(),
              lat: latitude,
              lon: longitude
            }),
            credentials: 'include'
          });

          if (response.ok) {
            setStatus("sent");
          } else {
            setStatus("error");
          }
        } catch (error) {
          console.error("Alert failed:", error);
          setStatus("error");
        }
      },
      (error) => {
        console.error("GPS error:", error);
        setStatus("error");
      },
      { enableHighAccuracy: true }
    );
  };

  const getStatusDisplay = () => {
    switch (status) {
      case "ready": return { text: "System Ready", color: "text-[#EAEAEA]", icon: <Activity className="w-5 h-5 md:w-6 md:h-6 text-[#888]" strokeWidth={1.5} /> };
      case "fetching": return { text: "Fetching Location", color: "text-[#A1A1AA]", icon: <MapPin className="w-5 h-5 md:w-6 md:h-6 text-[#A1A1AA] animate-pulse" strokeWidth={1.5} /> };
      case "sending": return { text: "Dispatching Alert", color: "text-[#EAEAEA]", icon: <PulseWave /> };
      case "sent": return { text: "Alert Sent", color: "text-[#34C759]", icon: <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} /> };
      case "error": return { text: "Failed to Send", color: "text-[#FF3B30]", icon: <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} /> };
    }
  };

  const currentStatus = getStatusDisplay();

  return (
    <div className="flex min-h-[100dvh] w-full flex-col px-6 pt-16 pb-10 md:py-24 relative overflow-hidden bg-[#0A0A0A]">
      <div className="fixed top-0 right-0 p-4 md:p-8 z-[100]">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05] text-[#555] hover:text-[#FF3B30] hover:bg-white/[0.08] hover:border-white/[0.1] transition-all duration-300 backdrop-blur-md group pointer-events-auto"
        >
          <span className="text-[13px] font-medium tracking-tight">Sign Out</span>
          <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2} />
        </button>
      </div>

      {/* Dynamic Background System */}
      <AnimatePresence>
        {activeService === "police" && status !== "ready" && (
          <PoliceBackground key="police" />
        )}
        {activeService === "ambulance" && status !== "ready" && (
          <MedicalBackground key="medical" />
        )}
        {activeService === "fire" && status !== "ready" && (
          <FireBackground key="fire" />
        )}
      </AnimatePresence>

      <div className="relative z-20 flex flex-col h-full w-full max-w-6xl mx-auto">

        <header className="mb-12 md:mb-24 flex flex-col items-center justify-center text-center relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05]"
          >
            <div className={clsx(
              "w-1.5 h-1.5 rounded-full",
              isOnline === true ? "bg-[#34C759] shadow-[0_0_8px_#34C759]" : 
              isOnline === false ? "bg-[#FF3B30] shadow-[0_0_8px_#FF3B30]" : 
              "bg-[#888] animate-pulse"
            )} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#555]">
              {isOnline === true ? "System Live" : isOnline === false ? "System Offline" : "Connecting..."}
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[28px] md:text-[44px] font-bold tracking-[-0.03em] text-[#EAEAEA] mb-2 md:mb-4"
          >
            Emergency Alert
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[15px] md:text-[19px] text-[#888888] font-normal"
          >
            Tap to request immediate assistance
          </motion.p>
        </header>

        <div className="flex-1 flex flex-col md:flex-row justify-center gap-6 md:gap-8 px-2 md:px-0">
          <ServiceButton
            type="police"
            label="Police"
            Icon={ShieldAlert}
            isActive={activeService === "police"}
            status={status}
            themeColor="rgb(0, 122, 255)"
            onClick={() => handleAlert("police")}
          />
          <ServiceButton
            type="ambulance"
            label="Ambulance"
            Icon={Ambulance}
            isActive={activeService === "ambulance"}
            status={status}
            themeColor="rgb(52, 199, 89)"
            onClick={() => handleAlert("ambulance")}
          />
          <ServiceButton
            type="fire"
            label="Fire"
            Icon={Flame}
            isActive={activeService === "fire"}
            status={status}
            themeColor="rgb(255, 59, 48)"
            onClick={() => handleAlert("fire")}
          />
        </div>

        <footer className="mt-16 md:mt-24 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.05] px-6 py-4 rounded-2xl backdrop-blur-md">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/[0.03] border border-white/[0.05]">
                {currentStatus?.icon}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#555555]">Status</span>
                <span className={clsx("text-[17px] font-semibold tracking-tight", currentStatus?.color)}>
                  {currentStatus?.text}
                </span>
              </div>
            </div>
          </motion.div>
        </footer>
      </div>
    </div>
  );
}

// --- Background Components ---

const PoliceBackground = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
  >
    <motion.div 
      animate={{ 
        backgroundColor: ["rgba(0,0,255,0.05)", "rgba(255,0,0,0.05)", "rgba(0,0,255,0.05)"] 
      }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0"
    />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,122,255,0.1)_0%,transparent_70%)]" />
  </motion.div>
);

const MedicalBackground = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 z-0 pointer-events-none"
  >
    <motion.div 
      animate={{ 
        opacity: [0.2, 0.4, 0.2]
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(52,199,89,0.15)_0%,transparent_70%)]"
    />
    <svg className="absolute bottom-0 left-0 w-full h-32 text-green-500/10" viewBox="0 0 1000 100" preserveAspectRatio="none">
      <motion.path 
        d="M0 50 L100 50 L120 20 L140 80 L160 50 L300 50 L320 10 L340 90 L360 50 L1000 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        animate={{ x: [-200, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  </motion.div>
);

const FireBackground = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
  >
    <motion.div 
      animate={{ 
        backgroundColor: ["rgba(255,59,48,0.05)", "rgba(255,149,0,0.08)", "rgba(255,59,48,0.05)"] 
      }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-0"
    />
    {/* Floating Embers */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-orange-500 rounded-full"
        initial={{ bottom: -20, left: `${Math.random() * 100}%`, opacity: 0 }}
        animate={{ 
          bottom: "120%", 
          opacity: [0, 1, 0],
          x: [0, Math.random() * 50 - 25]
        }}
        transition={{ 
          duration: 2 + Math.random() * 3, 
          repeat: Infinity, 
          delay: Math.random() * 2 
        }}
      />
    ))}
  </motion.div>
);

// --- Sub-components ---

const PulseWave = () => (
  <div className="relative flex h-5 w-5 md:h-6 md:w-6 items-center justify-center">
    <motion.div
      className="absolute h-full w-full rounded-full border border-white/[0.15]"
      animate={{ scale: [0.8, 1.8], opacity: [0.8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
    />
    <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-white/60" />
  </div>
);

function ServiceButton({ type, label, Icon, isActive, status, themeColor, onClick }: { 
  type: ServiceType; label: string; Icon: any; isActive: boolean; status: Status; themeColor: string; onClick: () => void; 
}) {
  const isProcessing = status === "fetching" || status === "sending";
  const disabled = isProcessing && !isActive;

  return (
    <motion.button
      whileHover={!disabled ? { y: -8, scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.96 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "relative flex flex-col items-center justify-center gap-6 md:gap-8 rounded-[40px] md:rounded-[56px] border transition-all duration-500",
        "h-[220px] w-full md:h-[380px] md:w-[280px] overflow-hidden group",
        isActive 
          ? "bg-white/[0.08] border-white/[0.2] shadow-[0_32px_80px_rgba(0,0,0,0.5)]" 
          : "bg-white/[0.01] border-white/[0.03] hover:bg-white/[0.03] hover:border-white/[0.08] opacity-70 hover:opacity-100",
        disabled && "opacity-20 grayscale pointer-events-none"
      )}
    >
      {/* Background fill on active */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-10"
        animate={{ backgroundColor: isActive ? themeColor : "transparent" }}
      />

      <div className={clsx(
        "relative z-10 flex h-16 w-16 md:h-24 md:w-24 items-center justify-center rounded-full transition-all duration-500",
        isActive ? "bg-white text-black scale-110 shadow-[0_0_30px_rgba(255,255,255,0.3)]" : "bg-white/[0.03] text-[#A1A1AA] group-hover:bg-white/[0.08] group-hover:text-white"
      )}>
        <Icon className="h-8 w-8 md:h-12 md:w-12" strokeWidth={1.2} />
      </div>
      
      <div className="relative z-10 flex flex-col items-center gap-2">
        <span className={clsx(
          "text-[20px] md:text-[28px] font-bold tracking-tight transition-colors duration-500",
          isActive ? "text-white" : "text-[#888888] group-hover:text-[#EAEAEA]"
        )}>
          {label}
        </span>
        <motion.div 
          className="h-1 rounded-full"
          animate={{ width: isActive ? 32 : 0, backgroundColor: isActive ? "white" : "transparent" }}
        />
      </div>

      {isActive && status === "sending" && (
        <motion.div 
          className="absolute inset-0 z-0 bg-white/[0.05]"
          animate={{ opacity: [0, 0.2, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
