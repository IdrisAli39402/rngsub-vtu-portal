import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Wallet, TrendUp, Lightning, MagnifyingGlass, Copy, CheckCircle, Clock, XCircle, Plus } from "@phosphor-icons/react";
import type { Transaction, TxStatus, ServiceType } from "../constants";
import { formatNaira, NETWORK_COLORS } from "../constants";
import { copyToClipboard } from "../lib/utils";
import QuickBuyWidget from "./QuickBuyWidget";

interface Props {
  walletBalance: number;
  transactions: Transaction[];
  onPurchase: (tx: Transaction, newBalance: number) => void;
  onFundWallet: (amount: number) => void;
  onViewReceipt: (tx: Transaction) => void;
}

const STATUS_CFG = {
  success: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
};

export default function Dashboard({ walletBalance, transactions, onPurchase, onFundWallet, onViewReceipt }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TxStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ServiceType | "all">("all");
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState(5000);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (statusFilter !== "all" && tx.status !== statusFilter) return false;
      if (typeFilter !== "all" && tx.type !== typeFilter) return false;
      if (search && !tx.phone.includes(search) && !tx.reference.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [transactions, statusFilter, typeFilter, search]);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayTx = transactions.filter((t) => new Date(t.timestamp).toDateString() === today);
    const totalSaved = transactions.reduce((s, t) => s + t.cashback, 0);
    return { todayCount: todayTx.length, totalSaved };
  }, [transactions]);

  const virtualAccount = "8012345678";

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Wallet Balance", value: formatNaira(walletBalance), icon: Wallet, accent: "text-[#0B45D8] bg-blue-50" },
          { label: "Top-ups Today", value: String(stats.todayCount), icon: Lightning, accent: "text-amber-600 bg-amber-50" },
          { label: "Total Cashback", value: formatNaira(stats.totalSaved), icon: TrendUp, accent: "text-emerald-600 bg-emerald-50" },
          { label: "Discount Tier", value: "SME Pro", icon: CheckCircle, accent: "text-purple-600 bg-purple-50" },
        ].map((m) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200 p-4"
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${m.accent}`}>
              <m.icon size={18} weight="bold" />
            </div>
            <p className="text-xs text-slate-500 font-medium">{m.label}</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{m.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Buy Widget */}
      <div className="grid lg:grid-cols-2 gap-6">
        <QuickBuyWidget walletBalance={walletBalance} onComplete={onPurchase} />

        {/* Fund Wallet Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Plus size={18} className="text-[#0B45D8]" weight="bold" /> Fund Wallet
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-2">Your Virtual Account (Providus Bank)</p>
              <div className="flex items-center gap-2">
                <code className="text-lg font-bold text-slate-900 tracking-wider">{virtualAccount}</code>
                <button
                  onClick={async () => {
                    const ok = await copyToClipboard(virtualAccount);
                    setCopied(ok);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Copy size={14} className={copied ? "text-emerald-600" : "text-slate-400"} />
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">Bank Transfer / USSD / Card</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">Quick Amount</label>
              <div className="grid grid-cols-3 gap-2">
                {[1000, 5000, 10000, 20000, 50000, 100000].map((a) => (
                  <button
                    key={a}
                    onClick={() => setFundAmount(a)}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                      fundAmount === a ? "border-[#0B45D8] bg-blue-50 text-[#0B45D8]" : "border-slate-200 text-slate-600"
                    }`}
                  >
                    {"₦"}{a.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => { onFundWallet(fundAmount); setShowFundModal(false); }}
              className="w-full py-3 rounded-xl bg-[#0B45D8] text-white font-bold text-sm hover:bg-[#0938B0] transition-colors active:scale-[0.98]"
            >
              Simulate Fund {"₦"}{fundAmount.toLocaleString()}
            </button>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h3 className="font-bold text-slate-900">Transaction History</h3>
            <div className="flex-1 flex flex-wrap gap-2 sm:justify-end">
              <div className="relative">
                <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B45D8]/20 w-36"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TxStatus | "all")}
                className="px-2 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as ServiceType | "all")}
                className="px-2 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
              >
                <option value="all">All Types</option>
                <option value="DATA">Data</option>
                <option value="AIRTIME">Airtime</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No transactions found.</div>
          ) : (
            filtered.map((tx) => {
              const cfg = STATUS_CFG[tx.status];
              const Icon = cfg.icon;
              return (
                <button
                  key={tx.id}
                  onClick={() => onViewReceipt(tx)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cfg.bg}`}>
                    <Icon size={16} className={cfg.color} weight="fill" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">{tx.plan}</span>
                      {tx.network && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${NETWORK_COLORS[tx.network].badge}`}>
                          {tx.network}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{tx.phone} &bull; {new Date(tx.timestamp).toLocaleDateString("en-NG")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{formatNaira(tx.amount)}</p>
                    <p className={`text-[10px] font-semibold uppercase ${cfg.color}`}>{tx.status}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}