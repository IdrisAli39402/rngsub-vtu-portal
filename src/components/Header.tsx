import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Wallet, List, X } from "@phosphor-icons/react";
import { formatNaira } from "../constants";

interface Props {
  view: "landing" | "dashboard";
  onToggleView: () => void;
  walletBalance: number;
}

const NAV_LINKS = ["Services", "Pricing", "API", "Support"];

export default function Header({ view, onToggleView, walletBalance }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B45D8] to-[#1E40AF] flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck size={20} className="text-white" weight="fill" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">
            RNG<span className="text-[#0B45D8]">SUB</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" className="text-sm font-medium text-slate-600 hover:text-[#0B45D8] transition-colors">
              {link}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {view === "dashboard" && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
              <Wallet size={14} className="text-emerald-600" weight="bold" />
              <span className="text-xs font-bold text-emerald-700">{formatNaira(walletBalance)}</span>
            </div>
          )}
          <button
            onClick={onToggleView}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
              view === "landing"
                ? "bg-[#0B45D8] text-white shadow-lg shadow-blue-500/25 hover:bg-[#0938B0]"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {view === "landing" ? "Get Started" : "Back to Home"}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
          {mobileOpen ? <X size={22} className="text-slate-700" /> : <List size={22} className="text-slate-700" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3"
        >
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" className="block text-sm font-medium text-slate-600 py-2">
              {link}
            </a>
          ))}
          <button
            onClick={() => { onToggleView(); setMobileOpen(false); }}
            className="w-full py-3 rounded-xl bg-[#0B45D8] text-white text-sm font-bold"
          >
            {view === "landing" ? "Launch Portal" : "Back to Home"}
          </button>
        </motion.div>
      )}
    </header>
  );
}
