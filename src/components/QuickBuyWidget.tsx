import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightning, ShieldCheck, Wallet, CreditCard, CheckCircle, Clock } from "@phosphor-icons/react";
import type { Network, ServiceType, DataCategory, Transaction } from "../constants";
import { DATA_PLANS, AIRTIME_AMOUNTS, NETWORK_COLORS, detectNetwork, generateRef, formatNaira } from "../constants";

interface Props {
  walletBalance: number;
  onComplete: (tx: Transaction, newBalance: number) => void;
}

const STEPS = ["Validating number...", "Querying telco gateway...", "Dispensing value...", "Completed!"];

export default function QuickBuyWidget({ walletBalance, onComplete }: Props) {
  const [service, setService] = useState<ServiceType>("DATA");
  const [network, setNetwork] = useState<Network>("MTN");
  const [category, setCategory] = useState<DataCategory>("SME");
  const [phone, setPhone] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [airtimeAmount, setAirtimeAmount] = useState<number>(500);
  const [payMethod, setPayMethod] = useState<"wallet" | "card">("wallet");
  const [processing, setProcessing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const autoDetected = useMemo(() => detectNetwork(phone), [phone]);
  const effectiveNetwork = autoDetected || network;

  const plans = useMemo(() => {
    if (service !== "DATA") return [];
    return DATA_PLANS.filter((p) => p.network === effectiveNetwork && p.category === category);
  }, [service, effectiveNetwork, category]);

  const selectedPlanData = useMemo(() => DATA_PLANS.find((p) => p.id === selectedPlan), [selectedPlan]);

  const cost = service === "DATA" ? (selectedPlanData?.price || 0) : airtimeAmount;
  const discount = service === "DATA" ? Math.round((selectedPlanData?.discount || 0) * cost / 100) : Math.round(airtimeAmount * 0.02);
  const finalCost = cost - discount;
  const cashback = Math.round(finalCost * 0.05);

  const canPurchase = phone.length >= 11 && (service === "AIRTIME" || selectedPlan) && finalCost > 0;
  const insufficientBalance = payMethod === "wallet" && finalCost > walletBalance;

  const handlePurchase = async () => {
    if (!canPurchase || insufficientBalance) return;
    setProcessing(true);
    setStepIndex(0);
    for (let i = 0; i < STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, i === STEPS.length - 1 ? 600 : 900));
      setStepIndex(i);
    }
    const tx: Transaction = {
      id: "tx-" + Date.now(),
      reference: generateRef(),
      type: service,
      network: effectiveNetwork,
      phone,
      plan: service === "DATA" ? `${selectedPlanData?.size} ${category}` : `N${airtimeAmount.toLocaleString()} Airtime`,
      amount: finalCost,
      status: "success",
      timestamp: new Date().toISOString(),
      method: payMethod === "wallet" ? "Wallet" : "Card",
      cashback,
    };
    onComplete(tx, walletBalance - finalCost + cashback);
    setProcessing(false);
    setPhone("");
    setSelectedPlan("");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Service Tabs */}
      <div className="flex border-b border-slate-200">
        {(["DATA", "AIRTIME"] as ServiceType[]).map((s) => (
          <button
            key={s}
            onClick={() => { setService(s); setSelectedPlan(""); }}
            className={`flex-1 py-3.5 text-sm font-semibold transition-all ${
              service === s ? "text-[#0B45D8] border-b-2 border-[#0B45D8] bg-blue-50/50" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {s === "DATA" ? "Data Bundles" : "Airtime"}
          </button>
        ))}
      </div>

      <div className="p-5 space-y-4">
        {/* Network Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Network</label>
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(NETWORK_COLORS) as Network[]).map((n) => (
              <button
                key={n}
                onClick={() => setNetwork(n)}
                className={`py-2 px-1 rounded-lg text-xs font-bold transition-all border ${
                  effectiveNetwork === n
                    ? "ring-2 ring-[#0B45D8] border-transparent scale-[1.02]"
                    : "border-slate-200 hover:border-slate-300"
                }`}
                style={{ backgroundColor: NETWORK_COLORS[n].bg, color: NETWORK_COLORS[n].text }}
              >
                {n}
              </button>
            ))}
          </div>
          {autoDetected && (
            <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
              <CheckCircle size={12} weight="fill" /> Auto-detected: {autoDetected}
            </p>
          )}
        </div>

        {/* Phone Input */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
            placeholder="e.g. 08031234567"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0B45D8]/30 focus:border-[#0B45D8] transition-all"
          />
        </div>

        {/* Data Category */}
        {service === "DATA" && (
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Plan Type</label>
            <div className="flex gap-2">
              {(["SME", "CORPORATE", "DIRECT"] as DataCategory[]).map((c) => (
                <button
                  key={c}
                  onClick={() => { setCategory(c); setSelectedPlan(""); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    category === c ? "bg-[#0B45D8] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Plan Grid */}
        {service === "DATA" && (
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Select Plan</label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {plans.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedPlan === p.id
                      ? "border-[#0B45D8] bg-blue-50 ring-1 ring-[#0B45D8]"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="text-sm font-bold text-slate-900">{p.size}</div>
                  <div className="text-xs text-slate-500">{p.validity}</div>
                  <div className="text-sm font-semibold text-[#0B45D8] mt-1">{formatNaira(p.price)}</div>
                  {p.discount > 0 && <div className="text-[10px] text-emerald-600 font-medium">{p.discount}% off</div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Airtime Quick Amounts */}
        {service === "AIRTIME" && (
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Amount</label>
            <div className="grid grid-cols-3 gap-2">
              {AIRTIME_AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAirtimeAmount(a)}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all border ${
                    airtimeAmount === a
                      ? "border-[#0B45D8] bg-blue-50 text-[#0B45D8]"
                      : "border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {"₦"}{a.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Payment</label>
          <div className="flex gap-2">
            <button
              onClick={() => setPayMethod("wallet")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                payMethod === "wallet" ? "border-[#0B45D8] bg-blue-50 text-[#0B45D8]" : "border-slate-200 text-slate-600"
              }`}
            >
              <Wallet size={16} /> Wallet ({formatNaira(walletBalance)})
            </button>
            <button
              onClick={() => setPayMethod("card")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                payMethod === "card" ? "border-[#0B45D8] bg-blue-50 text-[#0B45D8]" : "border-slate-200 text-slate-600"
              }`}
            >
              <CreditCard size={16} /> Card
            </button>
          </div>
          {insufficientBalance && (
            <p className="text-xs text-red-600 mt-1.5">Insufficient wallet balance. Use card or fund wallet.</p>
          )}
        </div>

        {/* Summary */}
        {canPurchase && (
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Cost</span><span className="font-medium">{formatNaira(cost)}</span></div>
            {discount > 0 && <div className="flex justify-between text-sm"><span className="text-emerald-600">Discount</span><span className="text-emerald-600 font-medium">-{formatNaira(discount)}</span></div>}
            <div className="flex justify-between text-sm"><span className="text-slate-500">Cashback (5%)</span><span className="text-emerald-600 font-medium">+{formatNaira(cashback)}</span></div>
            <div className="border-t border-slate-200 pt-2 flex justify-between"><span className="font-bold text-slate-900">Total</span><span className="font-bold text-[#0B45D8] text-lg">{formatNaira(finalCost)}</span></div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handlePurchase}
          disabled={!canPurchase || insufficientBalance || processing}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0B45D8] to-[#1E40AF] text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Lightning size={18} weight="fill" />
          {processing ? "Processing..." : `Buy ${service === "DATA" ? "Data" : "Airtime"} Now`}
        </button>
      </div>

      {/* Processing Modal */}
      <AnimatePresence>
        {processing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-8 w-full max-w-sm text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                <ShieldCheck size={32} className="text-[#0B45D8]" weight="fill" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-4">Processing Transaction</h3>
              <div className="space-y-3 text-left">
                {STEPS.map((s, i) => (
                  <div key={i} className={`flex items-center gap-3 text-sm ${i <= stepIndex ? "text-slate-900" : "text-slate-400"}`}>
                    {i < stepIndex ? (
                      <CheckCircle size={18} weight="fill" className="text-emerald-500" />
                    ) : i === stepIndex ? (
                      <Clock size={18} className="text-[#0B45D8] animate-spin" />
                    ) : (
                      <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-200" />
                    )}
                    {s}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
