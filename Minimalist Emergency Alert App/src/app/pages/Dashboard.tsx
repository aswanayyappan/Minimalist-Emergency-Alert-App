import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ShieldAlert, Ambulance, Flame, CheckCircle2, AlertTriangle, MapPin, Activity } from "lucide-react";
import { clsx } from "clsx";

type Status = "ready" | "fetching" | "sending" | "sent" | "error";
type ServiceType = "police" | "ambulance" | "fire" | null;

export function Dashboard() {
  const [status, setStatus] = useState<Status>("ready");
  const [activeService, setActiveService] = useState<ServiceType>(null);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/alert";
        const STATUS_URL = API_URL.replace("/alert", "/status");
        const res = await fetch(STATUS_URL);
        if (res.ok) setIsOnline(true);
        else setIsOnline(false);
      } catch (e) {
        setIsOnline(false);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

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
          const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/alert";
          const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: service?.toUpperCase(),
              lat: latitude,
              lon: longitude
            }),
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
        console.error("Location error:", error);
        setStatus("error");
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const resetState = () => {
    setStatus("ready");
    setActiveService(null);
  }

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

  const getGlowColor = () => {
    if (status !== "sending") return "transparent";
    switch (activeService) {
      case "police": return "rgba(255, 59, 48, 0.15)";
      case "ambulance": return "rgba(0, 122, 255, 0.15)";
      case "fire": return "rgba(255, 149, 0, 0.15)";
      default: return "transparent";
    }
  }

  return (
    <div className="flex min-h-[100dvh] w-full flex-col px-6 pt-16 pb-10 md:py-24 relative overflow-hidden">
      {/* Soft dynamic background glow */}
      <AnimatePresence>
        {status === "sending" && activeService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ 
              background: `radial-gradient(circle at 50% 50%, ${getGlowColor()} 0%, transparent 60%)` 
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col h-full w-full max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12 md:mb-24 flex flex-col items-center justify-center text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[28px] md:text-[44px] font-bold tracking-[-0.03em] text-[#EAEAEA] mb-2 md:mb-4"
          >
            Emergency Alert
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[15px] md:text-[19px] text-[#888888] font-normal mb-6"
          >
            Tap to request immediate assistance
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05]"
          >
            <div className={clsx(
              "w-2 h-2 rounded-full",
              isOnline === true ? "bg-[#34C759] shadow-[0_0_8px_#34C759]" : 
              isOnline === false ? "bg-[#FF3B30] shadow-[0_0_8px_#FF3B30]" : 
              "bg-[#888] animate-pulse"
            )} />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#888]">
              {isOnline === true ? "Network Online" : isOnline === false ? "Network Offline" : "Connecting..."}
            </span>
          </motion.div>
        </header>

        {/* Action Buttons */}
        <div className="flex-1 flex flex-col md:flex-row justify-center gap-6 md:gap-8 px-2 md:px-0">
          <ServiceButton
            type="police"
            label="Police"
            Icon={ShieldAlert}
            isActive={activeService === "police"}
            status={status}
            onClick={() => handleAlert("police")}
          />
          <ServiceButton
            type="ambulance"
            label="Ambulance"
            Icon={Ambulance}
            isActive={activeService === "ambulance"}
            status={status}
            onClick={() => handleAlert("ambulance")}
          />
          <ServiceButton
            type="fire"
            label="Fire"
            Icon={Flame}
            isActive={activeService === "fire"}
            status={status}
            onClick={() => handleAlert("fire")}
          />
        </div>

        {/* Status Panel */}
        <div className="mt-auto md:mt-24 pt-12 flex flex-col items-center">
           <AnimatePresence mode="wait">
             <motion.div 
               key={status}
               initial={{ opacity: 0, y: 15, scale: 0.98 }}
               animate={
                 status === "error" 
                   ? { opacity: 1, y: 0, scale: 1, x: [-2, 2, -2, 2, 0] } 
                   : { opacity: 1, y: 0, scale: 1, x: 0 }
               }
               exit={{ opacity: 0, y: -10, scale: 0.98 }}
               transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
               onClick={(status === "sent" || status === "error") ? resetState : undefined}
               className={clsx(
                 "mb-8 flex h-[68px] md:h-[80px] w-full max-w-[320px] md:max-w-[400px] items-center justify-center gap-4 rounded-[20px] md:rounded-[24px] backdrop-blur-2xl transition-all duration-500",
                 (status === "sent" || status === "error") ? "cursor-pointer hover:bg-[#1A1A1A]/80" : "cursor-default",
                 status === "sent" 
                   ? "bg-[#141414]/90 border border-[#34C759]/20 shadow-[0_16px_40px_rgba(0,0,0,0.4)]" 
                 : status === "error" 
                   ? "bg-[#141414]/90 border border-[#FF3B30]/20 shadow-[0_16px_40px_rgba(0,0,0,0.4)]" 
                 : "bg-[#121212]/80 border border-white/[0.04] shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
               )}
             >
                <div className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8">
                  {currentStatus.icon}
                </div>
                <span className={clsx("text-[15px] md:text-[17px] font-medium tracking-wide", currentStatus.color)}>
                  {currentStatus.text}
                </span>
             </motion.div>
           </AnimatePresence>

          <p className="text-center text-[10px] md:text-[12px] font-medium uppercase tracking-[0.2em] text-[#555555]">
            Secure Emergency Network Active
          </p>
        </div>
      </div>
    </div>
  );
}

const PulseWave = () => (
  <div className="relative flex h-5 w-5 md:h-6 md:w-6 items-center justify-center">
    <motion.div
      className="absolute h-full w-full rounded-full border border-white/[0.15]"
      animate={{ scale: [0.8, 1.8], opacity: [0.8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
    />
    <motion.div
      className="absolute h-full w-full rounded-full border border-white/[0.15]"
      animate={{ scale: [0.8, 1.8], opacity: [0.8, 0] }}
      transition={{ duration: 2, repeat: Infinity, delay: 1, ease: "easeOut" }}
    />
    <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-white/60" />
  </div>
);

function ServiceButton({ 
  type, 
  label, 
  Icon, 
  isActive, 
  status, 
  onClick 
}: { 
  type: ServiceType; 
  label: string; 
  Icon: any; 
  isActive: boolean; 
  status: Status; 
  onClick: () => void; 
}) {
  const isProcessing = status === "fetching" || status === "sending";
  const disabled = isProcessing && !isActive;

  const getStyles = () => {
    if (disabled) {
      return {
        background: "rgba(18, 18, 18, 0.4)",
        borderColor: "rgba(255, 255, 255, 0.02)",
        color: "rgba(255, 255, 255, 0.2)",
        boxShadow: "none"
      };
    }
    
    if (isActive) {
      const colors = {
        police: { from: 'rgba(255, 59, 48, 0.15)', to: 'rgba(255, 59, 48, 0.05)', border: 'rgba(255, 59, 48, 0.25)', glow: 'rgba(255, 59, 48, 0.1)' },
        ambulance: { from: 'rgba(0, 122, 255, 0.15)', to: 'rgba(0, 122, 255, 0.05)', border: 'rgba(0, 122, 255, 0.25)', glow: 'rgba(0, 122, 255, 0.1)' },
        fire: { from: 'rgba(255, 149, 0, 0.15)', to: 'rgba(255, 149, 0, 0.05)', border: 'rgba(255, 149, 0, 0.25)', glow: 'rgba(255, 149, 0, 0.1)' }
      }[type!];
      
      return {
        background: `linear-gradient(180deg, ${colors.from} 0%, ${colors.to} 100%)`,
        borderColor: colors.border,
        color: "#EAEAEA",
        boxShadow: `0 8px 32px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.04)`,
      };
    }

    return {
      background: `linear-gradient(180deg, rgba(22, 22, 22, 0.8) 0%, rgba(14, 14, 14, 0.8) 100%)`,
      borderColor: `rgba(255, 255, 255, 0.04)`,
      color: "#A1A1AA",
      boxShadow: `0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.02)`,
    };
  };

  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.96 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onClick}
      disabled={disabled}
      style={getStyles()}
      className={clsx(
        "relative flex w-full flex-1 items-center md:flex-col md:justify-center px-6 py-6 md:py-16 overflow-hidden rounded-[24px] md:rounded-[32px] border transition-all duration-500",
        !isActive && !disabled && "hover:bg-white/[0.03] hover:border-white/[0.06] hover:text-[#EAEAEA]"
      )}
    >
      <div className="flex items-center md:flex-col md:justify-center gap-6 z-10 w-full">
        <div className={clsx(
          "flex h-12 w-12 md:h-20 md:w-20 items-center justify-center rounded-[18px] md:rounded-[24px] transition-colors duration-500",
          isActive ? "bg-white/[0.05]" : "bg-white/[0.02]"
        )}>
          <Icon 
            className="w-6 h-6 md:w-10 md:h-10" 
            strokeWidth={1.5} 
            style={!disabled && !isActive ? { 
              color: type === 'police' ? '#FF3B30' : type === 'ambulance' ? '#007AFF' : '#FF9500' 
            } : {}} 
          />
        </div>
        <span className="text-[19px] md:text-[24px] font-medium tracking-[-0.01em]">{label}</span>
      </div>
    </motion.button>
  );
}
