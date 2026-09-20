// RNGSUB Types & Constants

export type Network = "MTN" | "AIRTEL" | "GLO" | "9MOBILE";
export type ServiceType = "DATA" | "AIRTIME" | "CABLE" | "ELECTRICITY";
export type DataCategory = "SME" | "CORPORATE" | "DIRECT";
export type TxStatus = "success" | "pending" | "failed";

export interface DataPlan {
  id: string;
  network: Network;
  category: DataCategory;
  size: string;
  validity: string;
  price: number;
  discount: number;
}

export interface Transaction {
  id: string;
  reference: string;
  type: ServiceType;
  network: Network | null;
  phone: string;
  plan: string;
  amount: number;
  status: TxStatus;
  timestamp: string;
  method: string;
  cashback: number;
}

export const NETWORK_COLORS: Record<Network, { bg: string; text: string; badge: string }> = {
  MTN: { bg: "#FFCC00", text: "#000", badge: "bg-yellow-400 text-black" },
  AIRTEL: { bg: "#E4002B", text: "#fff", badge: "bg-red-600 text-white" },
  GLO: { bg: "#00A85E", text: "#fff", badge: "bg-emerald-600 text-white" },
  "9MOBILE": { bg: "#4CAF50", text: "#fff", badge: "bg-green-700 text-white" },
};

export const PHONE_PREFIXES: Record<string, Network> = {
  "0803": "MTN", "0806": "MTN", "0810": "MTN", "0813": "MTN",
  "0814": "MTN", "0816": "MTN", "0703": "MTN", "0706": "MTN",
  "0802": "AIRTEL", "0808": "AIRTEL", "0812": "AIRTEL", "0811": "AIRTEL",
  "0701": "AIRTEL", "0708": "AIRTEL",
  "0805": "GLO", "0807": "GLO", "0815": "GLO", "0817": "GLO",
  "0705": "GLO", "0707": "GLO",
  "0809": "9MOBILE", "0818": "9MOBILE", "0819": "9MOBILE",
  "0909": "9MOBILE", "0908": "9MOBILE",
};

export const DATA_PLANS: DataPlan[] = [
  { id: "mtn-sme-1gb", network: "MTN", category: "SME", size: "1GB", validity: "30 days", price: 280, discount: 5 },
  { id: "mtn-sme-2gb", network: "MTN", category: "SME", size: "2GB", validity: "30 days", price: 560, discount: 5 },
  { id: "mtn-sme-5gb", network: "MTN", category: "SME", size: "5GB", validity: "30 days", price: 1400, discount: 5 },
  { id: "mtn-sme-10gb", network: "MTN", category: "SME", size: "10GB", validity: "30 days", price: 2500, discount: 5 },
  { id: "mtn-sme-20gb", network: "MTN", category: "SME", size: "20GB", validity: "30 days", price: 4800, discount: 5 },
  { id: "mtn-corp-1gb", network: "MTN", category: "CORPORATE", size: "1GB", validity: "30 days", price: 350, discount: 0 },
  { id: "mtn-corp-5gb", network: "MTN", category: "CORPORATE", size: "5GB", validity: "30 days", price: 1650, discount: 0 },
  { id: "mtn-corp-10gb", network: "MTN", category: "CORPORATE", size: "10GB", validity: "30 days", price: 3000, discount: 0 },
  { id: "mtn-dir-1gb", network: "MTN", category: "DIRECT", size: "1GB", validity: "30 days", price: 1000, discount: 0 },
  { id: "mtn-dir-2gb", network: "MTN", category: "DIRECT", size: "2GB", validity: "30 days", price: 1200, discount: 0 },
  { id: "mtn-dir-5gb", network: "MTN", category: "DIRECT", size: "5GB", validity: "30 days", price: 2800, discount: 0 },
  { id: "airtel-sme-1gb", network: "AIRTEL", category: "SME", size: "1GB", validity: "30 days", price: 300, discount: 5 },
  { id: "airtel-sme-2gb", network: "AIRTEL", category: "SME", size: "2GB", validity: "30 days", price: 580, discount: 5 },
  { id: "airtel-sme-5gb", network: "AIRTEL", category: "SME", size: "5GB", validity: "30 days", price: 1450, discount: 5 },
  { id: "airtel-sme-10gb", network: "AIRTEL", category: "SME", size: "10GB", validity: "30 days", price: 2600, discount: 5 },
  { id: "airtel-sme-20gb", network: "AIRTEL", category: "SME", size: "20GB", validity: "30 days", price: 5000, discount: 5 },
  { id: "airtel-corp-1gb", network: "AIRTEL", category: "CORPORATE", size: "1GB", validity: "30 days", price: 380, discount: 0 },
  { id: "airtel-corp-5gb", network: "AIRTEL", category: "CORPORATE", size: "5GB", validity: "30 days", price: 1700, discount: 0 },
  { id: "airtel-dir-1gb", network: "AIRTEL", category: "DIRECT", size: "1GB", validity: "30 days", price: 1050, discount: 0 },
  { id: "glo-sme-1gb", network: "GLO", category: "SME", size: "1GB", validity: "30 days", price: 250, discount: 5 },
  { id: "glo-sme-2gb", network: "GLO", category: "SME", size: "2GB", validity: "30 days", price: 500, discount: 5 },
  { id: "glo-sme-5gb", network: "GLO", category: "SME", size: "5GB", validity: "30 days", price: 1250, discount: 5 },
  { id: "glo-sme-10gb", network: "GLO", category: "SME", size: "10GB", validity: "30 days", price: 2200, discount: 5 },
  { id: "glo-corp-1gb", network: "GLO", category: "CORPORATE", size: "1GB", validity: "30 days", price: 320, discount: 0 },
  { id: "glo-corp-5gb", network: "GLO", category: "CORPORATE", size: "5GB", validity: "30 days", price: 1500, discount: 0 },
  { id: "glo-dir-1gb", network: "GLO", category: "DIRECT", size: "1GB", validity: "30 days", price: 950, discount: 0 },
  { id: "9mob-sme-1gb", network: "9MOBILE", category: "SME", size: "1GB", validity: "30 days", price: 270, discount: 5 },
  { id: "9mob-sme-2gb", network: "9MOBILE", category: "SME", size: "2GB", validity: "30 days", price: 540, discount: 5 },
  { id: "9mob-sme-5gb", network: "9MOBILE", category: "SME", size: "5GB", validity: "30 days", price: 1350, discount: 5 },
  { id: "9mob-sme-10gb", network: "9MOBILE", category: "SME", size: "10GB", validity: "30 days", price: 2400, discount: 5 },
  { id: "9mob-corp-1gb", network: "9MOBILE", category: "CORPORATE", size: "1GB", validity: "30 days", price: 360, discount: 0 },
  { id: "9mob-corp-5gb", network: "9MOBILE", category: "CORPORATE", size: "5GB", validity: "30 days", price: 1600, discount: 0 },
  { id: "9mob-dir-1gb", network: "9MOBILE", category: "DIRECT", size: "1GB", validity: "30 days", price: 1000, discount: 0 },
];

export const AIRTIME_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "tx-001", reference: "RNG-2024-001A7F", type: "DATA", network: "MTN", phone: "08031234567", plan: "5GB SME", amount: 1400, status: "success", timestamp: "2024-12-15T10:23:00Z", method: "Wallet", cashback: 70 },
  { id: "tx-002", reference: "RNG-2024-001A80", type: "AIRTIME", network: "AIRTEL", phone: "08029876543", plan: "N1,000 Airtime", amount: 980, status: "success", timestamp: "2024-12-15T09:15:00Z", method: "Wallet", cashback: 20 },
  { id: "tx-003", reference: "RNG-2024-001A81", type: "DATA", network: "GLO", phone: "08055566778", plan: "2GB SME", amount: 500, status: "pending", timestamp: "2024-12-14T18:45:00Z", method: "Card", cashback: 0 },
  { id: "tx-004", reference: "RNG-2024-001A82", type: "DATA", network: "9MOBILE", phone: "08091122334", plan: "1GB SME", amount: 270, status: "failed", timestamp: "2024-12-14T14:30:00Z", method: "Wallet", cashback: 0 },
  { id: "tx-005", reference: "RNG-2024-001A83", type: "AIRTIME", network: "MTN", phone: "08164455667", plan: "N500 Airtime", amount: 490, status: "success", timestamp: "2024-12-13T11:00:00Z", method: "Wallet", cashback: 10 },
  { id: "tx-006", reference: "RNG-2024-001A84", type: "DATA", network: "MTN", phone: "07032233445", plan: "10GB SME", amount: 2500, status: "success", timestamp: "2024-12-12T16:20:00Z", method: "Bank Transfer", cashback: 125 },
];

export const WALLET_KEY = "rngsub_wallet_balance";
export const TX_KEY = "rngsub_transactions";
export const DEFAULT_BALANCE = 15450;

export function detectNetwork(phone: string): Network | null {
  const prefix = phone.slice(0, 4);
  return PHONE_PREFIXES[prefix] || null;
}

export function generateRef(): string {
  return "RNG-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
}

export function formatNaira(amount: number): string {
  return "₦" + amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
