import { motion, AnimatePresence } from "framer-motion";
import { X, Printer, ShareNetwork, ArrowsClockwise, ShieldCheck, CheckCircle, Clock, XCircle } from "@phosphor-icons/react";
import type { Transaction } from "../constants";
import { formatNaira, NETWORK_COLORS } from "../constants";
import { copyToClipboard } from "../lib/utils";

interface Props {
  tx: Transaction | null;
  onClose: () => void;
  onNewPurchase: () => void;
}

const StatusBadge = ({ status }: { status: Transaction["status"] }) => {
  const cfg = {
    success: { color: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: CheckCircle },
    pending: { color: "text-amber-700 bg-amber-50 border-amber-200", icon: Clock },
    failed: { color: "text-red-700 bg-red-50 border-red-200", icon: XCircle },
  }[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <Icon size={14} weight="bold" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function TransactionReceipt({ tx, onClose, onNewPurchase }: Props) {
  if (!tx) return null;

  const netColor = tx.network ? NETWORK_COLORS[tx.network] : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0B45D8] to-[#1E40AF] px-6 py-5 text-white relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
              <X size={20} weight="bold" />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={20} weight="fill" />
              <span className="font-bold text-lg tracking-tight">RNGSUB</span>
            </div>
            <p className="text-blue-100 text-sm">Transaction Receipt</p>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <StatusBadge status={tx.status} />
              {netColor && (
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${netColor.badge}`}>
                  {tx.network}
                </span>
              )}
            </div>

            <div className="space-y-3">
              {[
                { label: "Reference", value: tx.reference },
                { label: "Date", value: new Date(tx.timestamp).toLocaleString("en-NG") },
                { label: "Type", value: tx.type === "DATA" ? "Data Bundle" : tx.type === "AIRTIME" ? "Airtime" : tx.type },
                { label: "Plan", value: tx.plan },
                { label: "Beneficiary", value: tx.phone },
                { label: "Amount", value: formatNaira(tx.amount) },
                { label: "Method", value: tx.method },
                { label: "Cashback", value: tx.cashback > 0 ? formatNaira(tx.cashback) : "N/A" },
                { label: "API Response", value: tx.status === "success" ? "200 SUCCESS" : tx.status === "pending" ? "202 PROCESSING" : "400 FAILED" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-500">{row.label}</span>
                  <span className="text-sm font-semibold text-slate-900">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex flex-wrap gap-2">
            <button
              onClick={() => window.print()}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0B45D8] text-white rounded-xl text-sm font-semibold hover:bg-[#0938B0] transition-colors active:scale-[0.98]"
            >
              <Printer size={16} /> Print
            </button>
            <button
              onClick={async () => {
                await copyToClipboard(
                  `RNGSUB Receipt: ${tx.reference} | ${tx.plan} | ${formatNaira(tx.amount)} | ${tx.status.toUpperCase()}`
                );
              }}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors active:scale-[0.98]"
            >
              <ShareNetwork size={16} /> Share
            </button>
            <button
              onClick={onNewPurchase}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors active:scale-[0.98]"
            >
              <ArrowsClockwise size={16} /> New Top-up
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}