export type Segmen = 'SME' | 'Enterprise';
export type Skema = 'recurring' | 'otc';
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
}

export interface QuoteParams {
  namaKlien: string;
  segmen: Segmen;
  region: string;
  jumlahUser: number;
  bandwidthTarget: number;
  durasiKontrak: number;
  durasiPM: number;
  jarakKabel: number;
  jarakKota: number;
  hariKerja: number;
  jumlahKunjungan: number;
  jumlahMeeting: number;
  selectedSolusi: SolutionKey[];
  targetMargin: number;
  komisi: number;
  diskon: number;
  skema: Skema;
  jborRate: number;
  provisiRate: number;
  budgetTierFilter: BudgetTier;
  qtyMap: Record<string, number>;
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
