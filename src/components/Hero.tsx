import { motion } from "framer-motion";
import { Lightning, ShieldCheck, Lock, ArrowRight, CellSignalHigh, WifiHigh, Phone, Globe } from "@phosphor-icons/react";
import { NETWORK_COLORS } from "../constants";
import type { Network } from "../constants";

interface Props {
  onGetStarted: () => void;
  onBuyData: () => void;
}

const NETWORKS: { name: Network; icon: typeof Phone }[] = [
  { name: "MTN", icon: CellSignalHigh },
  { name: "AIRTEL", icon: Phone },
  { name: "GLO", icon: WifiHigh },
  { name: "9MOBILE", icon: Globe },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "99.9% Uptime" },
  { icon: Lightning, label: "<3s Delivery" },
  { icon: Lock, label: "256-bit Encryption" },
];

export default function Hero({ onGetStarted, onBuyData }: Props) {
  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A2540] via-[#0B45D8] to-[#1E40AF]" />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      {/* Aurora blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-6">
                {NETWORKS.map((n) => (
                  <span
                    key={n.name}
                    className="px-3 py-1 rounded-full text-[11px] font-bold"
                    style={{ backgroundColor: NETWORK_COLORS[n.name].bg, color: NETWORK_COLORS[n.name].text }}
                  >
                    {n.name}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6"
            >
              RNGSUB:{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                Fast, Affordable & Reliable VTU Services
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-blue-100/90 leading-relaxed max-w-[65ch] mb-8"
            >
              Instant automated airtime and data top-up across MTN, Airtel, Glo, and 9mobile at wholesale prices. Instant delivery 24/7.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <button
                onClick={onBuyData}
                className="px-7 py-3.5 bg-white text-[#0B45D8] font-bold rounded-xl text-sm shadow-xl shadow-black/10 hover:shadow-black/20 hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center gap-2"
              >
                <Lightning size={18} weight="fill" /> Buy Data
              </button>
              <button
                onClick={onGetStarted}
                className="px-7 py-3.5 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl text-sm border border-white/20 hover:bg-white/20 transition-all active:scale-[0.98] flex items-center gap-2"
              >
                Get Started <ArrowRight size={16} weight="bold" />
              </button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-6 mt-10"
            >
              {TRUST_BADGES.map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-blue-200/80 text-sm">
                  <b.icon size={16} weight="bold" />
                  <span className="font-medium">{b.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Live Rate Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-bold text-sm">Live Data Rates</h3>
                <span className="flex items-center gap-1.5 text-emerald-300 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Online
                </span>
              </div>
              <div className="space-y-3">
                {[
                  { network: "MTN", size: "1GB", price: "₦280", pct: "-35%" },
                  { network: "AIRTEL", size: "2GB", price: "₦580", pct: "-30%" },
                  { network: "GLO", size: "5GB", price: "₦1,250", pct: "-40%" },
                  { network: "9MOBILE", size: "1GB", price: "₦270", pct: "-38%" },
                ].map((r) => (
                  <div key={r.network} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: NETWORK_COLORS[r.network as Network].bg }} />
                      <span className="text-white text-sm font-semibold">{r.network}</span>
                      <span className="text-blue-200/60 text-xs">{r.size}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-300 text-xs font-bold">{r.pct}</span>
                      <span className="text-white text-sm font-bold">{r.price}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-blue-200/50 text-xs mt-4 text-center">Wholesale SME rates &bull; Updated live</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
