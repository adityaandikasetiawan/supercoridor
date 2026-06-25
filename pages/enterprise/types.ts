export type Segmen = 'SME' | 'Enterprise';
export type Skema = 'recurring' | 'otc' | 'otc_mrc';
export type BudgetTier = 'All' | 'Low' | 'Medium' | 'High';
export type QuoteStatus = 'draft' | 'submitted' | 'approved' | 'rejected';
export type SolutionKey = 'internet' | 'router' | 'sdwan' | 'firewall' | 'cctv' | 'wifi' | 'switch' | 'switch_l2' | 'server' | 'storage' | 'ippbx';

export interface Device {
  id: number;
  kategori: string;
  segmen: Segmen;
  nama: string;
  brand: string;
  userMin: number;
  userMax: number;
  bwMin?: number;
  bwMax?: number;
  hargaHW: number;
  hargaBW: number;
  budgetTier: string;
  isActive: boolean;
  // Cable-specific fields
  tipeKabel?: string;       // FO, UTP, STP, Coaxial, dll
  spesifikasi?: string;     // Single Mode, Multimode, Cat6, Cat7, dll
  hargaPerMeter?: number;   // Harga per meter kabel
  satuanPanjang?: string;   // meter / roll (default meter)
}

export interface QuoteParams {
  namaKlien: string;
  segmen: Segmen;
  region: string;
  regionAsal: string;
  regionTujuan: string;
  kotaAsal: string;
  kotaTujuan: string;
  services: string;
  jumlahUser: number;
  bandwidthTarget: number;
  durasiKontrak: number;
  durasiPM: number;
  jarakKabel: number;
  jarakKota: number;
  hariKerja: number;
  operasionalPct: number;   // % of HW cost for perjalanan + operasional (from config, editable)
  selectedSolusi: SolutionKey[];
  targetMargin: number;
  komisi: number;
  diskon: number;
  skema: Skema;
  jborRate: number;
  provisiRate: number;
  budgetTierFilter: BudgetTier;
  qtyMap: Record<string, number>;
  deviceMap: Record<string, string>;  // kategori -> device name (selected device per solution)
  wifiConfig: { mode: 'standalone' | 'wlc'; wlcModel?: string; wlcQty?: number; wlcHarga?: number; wlcBrand?: string };
  cctvConfig: { type: 'nvr' | 'dvr'; recQty: number; camQty: number };
  ippbxConfig: { pbxQty: number; phoneQty: number };
}

export interface Recommendation {
  solution: string;
  brand: string;
  segmen: Segmen;
  skema: Skema;
  hargaNet: number;
  hargaNetBulan: number;
  hargaOTC: number;
  hargaMRC: number;
  totalRev: number;
  totalCost: number;
  margin: number;
  komisiRp: number;
  comVal: number;
  comAnnualPct: number;
  payback: number;
  data: Record<string, unknown>;
}

export interface Quote {
  id: string;
  namaKlien: string;
  segmen: Segmen;
  region: string;
  status: QuoteStatus;
  calculation?: Recommendation;
  userId?: string;
  userName?: string;
  createdAt: string;
  updatedAt: string;
}

export const SOLUTION_LABELS: Record<SolutionKey, string> = {
  internet: 'Internet', router: 'Router', sdwan: 'SD-WAN', firewall: 'Firewall',
  cctv: 'CCTV', wifi: 'WiFi', switch: 'Switch L3', switch_l2: 'Switch L2',
  server: 'Server', storage: 'Storage', ippbx: 'IP-PBX',
};

export const REGIONS = ['JABOTABEK', 'BANTEN', 'JABAR', 'JATENG', 'JATIM', 'KALIMANTAN', 'SULAWESI', 'BALI'];

export interface PackageItem {
  nama: string;
  brand: string;
  qty: number;
  keterangan?: string;
}

export interface EnterprisePackage {
  id: string;
  nama: string;
  deskripsi: string;
  segmen: Segmen;
  budgetTier: string;
  skema: Skema;
  durasiKontrak: number;
  hargaBulan: number | null;
  hargaOTC: number | null;
  perangkat: PackageItem[];
  fitur: string[];
  services: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}
