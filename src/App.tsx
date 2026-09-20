import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Lightning, Globe, Lock, Users, TrendUp } from "@phosphor-icons/react";
import type { Transaction } from "./constants";
import { INITIAL_TRANSACTIONS, WALLET_KEY, TX_KEY, DEFAULT_BALANCE } from "./constants";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Dashboard from "./components/Dashboard";
import TransactionReceipt from "./components/TransactionReceipt";

const FEATURES = [
  { icon: Lightning, title: "Instant Delivery", desc: "Sub-3 second automated top-ups across all Nigerian networks." },
  { icon: TrendUp, title: "Wholesale Pricing", desc: "Save up to 40% on data bundles with SME corporate rates." },
  { icon: Lock, title: "Bank-grade Security", desc: "256-bit encryption and PCI-DSS compliant payment processing." },
  { icon: Globe, title: "API Access", desc: "RESTful API for developers and resellers with 99.9% uptime SLA." },
  { icon: Users, title: "Reseller Program", desc: "Earn up to 15% commission by building your own VTU business." },
  { icon: ShieldCheck, title: "Money-back Guarantee", desc: "Failed transactions auto-refunded within 60 seconds." },
];

function App() {
  const [view, setView] = useState<"landing" | "dashboard">("landing");
  const [walletBalance, setWalletBalance] = useState<number>(DEFAULT_BALANCE);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(WALLET_KEY);
    if (saved) setWalletBalance(Number(saved));
    const savedTx = localStorage.getItem(TX_KEY);
    if (savedTx) {
      try { setTransactions(JSON.parse(savedTx)); } catch { /* use defaults */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(WALLET_KEY, String(walletBalance));
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem(TX_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const handlePurchase = useCallback((tx: Transaction, newBalance: number) => {
    setTransactions((prev) => [tx, ...prev]);
    setWalletBalance(newBalance);
    setSelectedTx(tx);
  }, []);

  const handleFundWallet = useCallback((amount: number) => {
    setWalletBalance((prev) => prev + amount);
    const fundTx: Transaction = {
      id: "tx-fund-" + Date.now(),
      reference: "RNG-FUND-" + Date.now().toString(36).toUpperCase(),
      type: "DATA",
      network: null,
      phone: "Wallet",
      plan: "Wallet Funding",
      amount,
      status: "success",
      timestamp: new Date().toISOString(),
      method: "Bank Transfer",
      cashback: 0,
    };
    setTransactions((prev) => [fundTx, ...prev]);
  }, []);

  const scrollToPortal = () => {
    setView("dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Header view={view} onToggleView={() => setView(view === "landing" ? "dashboard" : "landing")} walletBalance={walletBalance} />

      <AnimatePresence mode="wait">
        {view === "landing" ? (
          <motion.main
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Hero onGetStarted={scrollToPortal} onBuyData={scrollToPortal} />

            {/* Features Bento */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Why VTU Providers Choose <span className="text-[#0B45D8]">RNGSUB</span>
                </h2>
                <p className="text-slate-500 mt-3 max-w-lg mx-auto">Built for speed, priced for profit, secured for trust.</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {FEATURES.map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 transition-all"
                  >
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                      <f.icon size={22} className="text-[#0B45D8]" weight="bold" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1.5">{f.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Pricing Section */}
            <section className="bg-gradient-to-b from-[#0A2540] to-[#0B45D8] py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Wholesale Data Pricing</h2>
                  <p className="text-blue-200/80 mt-3">Up to 40% cheaper than retail. SME rates for everyone.</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(["MTN", "AIRTEL", "GLO", "9MOBILE"] as const).map((net) => (
                    <div key={net} className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
                      <h4 className="text-white font-bold text-sm mb-3">{net}</h4>
                      <div className="space-y-2">
                        {[
                          { size: "1GB", price: net === "MTN" ? 280 : net === "AIRTEL" ? 300 : net === "GLO" ? 250 : 270 },
                          { size: "2GB", price: net === "MTN" ? 560 : net === "AIRTEL" ? 580 : net === "GLO" ? 500 : 540 },
                          { size: "5GB", price: net === "MTN" ? 1400 : net === "AIRTEL" ? 1450 : net === "GLO" ? 1250 : 1350 },
                          { size: "10GB", price: net === "MTN" ? 2500 : net === "AIRTEL" ? 2600 : net === "GLO" ? 2200 : 2400 },
                        ].map((p) => (
                          <div key={p.size} className="flex justify-between items-center text-sm">
                            <span className="text-blue-200">{p.size}</span>
                            <span className="text-white font-bold">{"₦"}{p.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-10">
                  <button
                    onClick={scrollToPortal}
                    className="px-8 py-3.5 bg-white text-[#0B45D8] font-bold rounded-xl text-sm shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-[0.98]"
                  >
                    Start Buying at These Rates
                  </button>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#0A2540] border-t border-white/5 py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#0B45D8] flex items-center justify-center">
                      <ShieldCheck size={16} className="text-white" weight="fill" />
                    </div>
                    <span className="text-white font-bold">RNG<span className="text-blue-300">SUB</span></span>
                  </div>
                  <p className="text-blue-200/50 text-sm">&copy; 2024 RNGSUB. All rights reserved. Licensed VTU provider in Nigeria.</p>
                </div>
              </div>
            </footer>
          </motion.main>
        ) : (
          <motion.main
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            <div className="mb-6">
              <h1 className="text-2xl font-black text-slate-900">VTU Dashboard</h1>
              <p className="text-sm text-slate-500 mt-1">Buy data, airtime, and manage your wallet.</p>
            </div>
            <Dashboard
              walletBalance={walletBalance}
              transactions={transactions}
              onPurchase={handlePurchase}
              onFundWallet={handleFundWallet}
              onViewReceipt={setSelectedTx}
            />
          </motion.main>
        )}
      </AnimatePresence>

      {/* Receipt Modal */}
      <TransactionReceipt
        tx={selectedTx}
        onClose={() => setSelectedTx(null)}
        onNewPurchase={() => { setSelectedTx(null); }}
      />
    </div>
  );
}

export default App;
