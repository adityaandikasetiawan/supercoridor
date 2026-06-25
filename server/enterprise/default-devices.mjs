/**
 * Default device database for Solusi Enterprise pricing engine
 */
export const DEFAULT_DEVICES = [
  // INTERNET - SME
  { kategori:'internet', segmen:'SME', nama:'50 Mbps Shared 1:8', brand:'-', userMin:5, userMax:30, bwMin:30, bwMax:80, hargaHW:0, hargaBW:200000, budgetTier:'Low' },
  { kategori:'internet', segmen:'SME', nama:'100 Mbps Shared 1:8', brand:'-', userMin:10, userMax:50, bwMin:70, bwMax:150, hargaHW:0, hargaBW:350000, budgetTier:'Low' },
  { kategori:'internet', segmen:'SME', nama:'200 Mbps Shared 1:4', brand:'-', userMin:20, userMax:80, bwMin:150, bwMax:250, hargaHW:0, hargaBW:650000, budgetTier:'Low' },
  { kategori:'internet', segmen:'SME', nama:'300 Mbps Shared 1:4', brand:'-', userMin:30, userMax:100, bwMin:250, bwMax:350, hargaHW:0, hargaBW:950000, budgetTier:'Medium' },
  { kategori:'internet', segmen:'SME', nama:'500 Mbps CIR 1:2', brand:'-', userMin:50, userMax:150, bwMin:350, bwMax:600, hargaHW:0, hargaBW:1800000, budgetTier:'Medium' },
  { kategori:'internet', segmen:'SME', nama:'1 Gbps CIR 1:2', brand:'-', userMin:80, userMax:200, bwMin:600, bwMax:1100, hargaHW:0, hargaBW:3200000, budgetTier:'High' },
  // INTERNET - Enterprise
  { kategori:'internet', segmen:'Enterprise', nama:'500 Mbps CIR 1:1', brand:'-', userMin:50, userMax:300, bwMin:450, bwMax:600, hargaHW:0, hargaBW:3800000, budgetTier:'Low' },
  { kategori:'internet', segmen:'Enterprise', nama:'1 Gbps CIR 1:1', brand:'-', userMin:100, userMax:500, bwMin:900, bwMax:1100, hargaHW:0, hargaBW:6500000, budgetTier:'Low' },
  { kategori:'internet', segmen:'Enterprise', nama:'2 Gbps CIR 1:1', brand:'-', userMin:200, userMax:1000, bwMin:1800, bwMax:2200, hargaHW:0, hargaBW:12000000, budgetTier:'Medium' },
  { kategori:'internet', segmen:'Enterprise', nama:'5 Gbps CIR 1:1', brand:'-', userMin:500, userMax:2500, bwMin:4500, bwMax:5500, hargaHW:0, hargaBW:28000000, budgetTier:'Medium' },
  { kategori:'internet', segmen:'Enterprise', nama:'10 Gbps CIR 1:1', brand:'-', userMin:1000, userMax:5000, bwMin:9000, bwMax:11000, hargaHW:0, hargaBW:48000000, budgetTier:'High' },
  { kategori:'internet', segmen:'Enterprise', nama:'40 Gbps CIR 1:1', brand:'-', userMin:5000, userMax:20000, bwMin:35000, bwMax:45000, hargaHW:0, hargaBW:150000000, budgetTier:'High' },
  { kategori:'internet', segmen:'Enterprise', nama:'100 Gbps CIR 1:1', brand:'-', userMin:10000, userMax:50000, bwMin:90000, bwMax:110000, hargaHW:0, hargaBW:350000000, budgetTier:'High' },
  { kategori:'internet', segmen:'Enterprise', nama:'400 Gbps Backbone', brand:'-', userMin:50000, userMax:200000, bwMin:350000, bwMax:450000, hargaHW:0, hargaBW:1200000000, budgetTier:'High' },
  { kategori:'internet', segmen:'Enterprise', nama:'1 Tbps Backbone', brand:'-', userMin:200000, userMax:1000000, bwMin:900000, bwMax:1100000, hargaHW:0, hargaBW:2800000000, budgetTier:'High' },
  // WIFI
  { kategori:'wifi', segmen:'SME', nama:'4x TP-Link EAP225 AC1200', brand:'TP-Link', userMin:10, userMax:50, hargaHW:1800000, hargaBW:0, budgetTier:'Low' },
  { kategori:'wifi', segmen:'SME', nama:'6x MikroTik hAP ac3', brand:'MikroTik', userMin:30, userMax:100, hargaHW:4800000, hargaBW:0, budgetTier:'Low' },
  { kategori:'wifi', segmen:'SME', nama:'6x Ubiquiti U6-Lite WiFi6', brand:'Ubiquiti', userMin:20, userMax:80, hargaHW:5400000, hargaBW:0, budgetTier:'Low' },
  { kategori:'wifi', segmen:'SME', nama:'8x Ruijie RG-RAP2260 AX3000', brand:'Ruijie', userMin:40, userMax:100, hargaHW:7200000, hargaBW:0, budgetTier:'Medium' },
  { kategori:'wifi', segmen:'Enterprise', nama:'12x MikroTik cAP XL ac', brand:'MikroTik', userMin:80, userMax:200, hargaHW:12000000, hargaBW:0, budgetTier:'Low' },
  { kategori:'wifi', segmen:'Enterprise', nama:'16x Ubiquiti U6-Enterprise WiFi6', brand:'Ubiquiti', userMin:100, userMax:500, hargaHW:34000000, hargaBW:0, budgetTier:'Medium' },
  { kategori:'wifi', segmen:'Enterprise', nama:'20x Ruijie RG-RAP6268 AX6000 PoE', brand:'Ruijie', userMin:100, userMax:1000, hargaHW:32000000, hargaBW:0, budgetTier:'Medium' },
  { kategori:'wifi', segmen:'Enterprise', nama:'24x Aruba AP-535 WiFi6', brand:'Aruba', userMin:150, userMax:2000, hargaHW:75000000, hargaBW:0, budgetTier:'High' },
  { kategori:'wifi', segmen:'Enterprise', nama:'32x Cisco 9120AX WiFi6', brand:'Cisco', userMin:200, userMax:5000, hargaHW:115000000, hargaBW:0, budgetTier:'High' },
  { kategori:'wifi', segmen:'Enterprise', nama:'Enterprise WiFi Mesh (custom)', brand:'Cisco', userMin:5000, userMax:1000000, hargaHW:500000000, hargaBW:0, budgetTier:'High' },
  // FIREWALL
  { kategori:'firewall', segmen:'SME', nama:'MikroTik RB5009 Firewall', brand:'MikroTik', userMin:10, userMax:40, hargaHW:3800000, hargaBW:0, budgetTier:'Low' },
  { kategori:'firewall', segmen:'SME', nama:'Fortinet FortiGate 40F', brand:'Fortinet', userMin:10, userMax:30, hargaHW:5000000, hargaBW:650000, budgetTier:'Medium' },
  { kategori:'firewall', segmen:'SME', nama:'Fortinet FortiGate 60F', brand:'Fortinet', userMin:20, userMax:50, hargaHW:7200000, hargaBW:1000000, budgetTier:'Medium' },
  { kategori:'firewall', segmen:'SME', nama:'Sophos XGS 87 Firewall', brand:'Sophos', userMin:15, userMax:100, hargaHW:8800000, hargaBW:1300000, budgetTier:'Medium' },
  { kategori:'firewall', segmen:'Enterprise', nama:'MikroTik CCR2216 Firewall', brand:'MikroTik', userMin:100, userMax:1000, hargaHW:35000000, hargaBW:0, budgetTier:'Medium' },
  { kategori:'firewall', segmen:'Enterprise', nama:'Fortinet FortiGate 200F', brand:'Fortinet', userMin:100, userMax:2000, hargaHW:38000000, hargaBW:5500000, budgetTier:'Medium' },
  { kategori:'firewall', segmen:'Enterprise', nama:'Palo Alto PA-440', brand:'Palo Alto', userMin:100, userMax:1000, hargaHW:50000000, hargaBW:9000000, budgetTier:'High' },
  { kategori:'firewall', segmen:'Enterprise', nama:'Palo Alto PA-3260', brand:'Palo Alto', userMin:1000, userMax:10000, hargaHW:350000000, hargaBW:45000000, budgetTier:'High' },
  { kategori:'firewall', segmen:'Enterprise', nama:'Palo Alto PA-5260 (40G)', brand:'Palo Alto', userMin:10000, userMax:100000, hargaHW:1200000000, hargaBW:120000000, budgetTier:'High' },
  { kategori:'firewall', segmen:'Enterprise', nama:'Fortinet FortiGate 4400F (100G+)', brand:'Fortinet', userMin:50000, userMax:1000000, hargaHW:3500000000, hargaBW:300000000, budgetTier:'High' },
  // ROUTER
  { kategori:'router', segmen:'SME', nama:'MikroTik RB4011 Router', brand:'MikroTik', userMin:10, userMax:80, bwMin:100, bwMax:2000, hargaHW:4800000, hargaBW:0, budgetTier:'Low' },
  { kategori:'router', segmen:'SME', nama:'Ruijie RG-EG205G-E', brand:'Ruijie', userMin:10, userMax:80, bwMin:50, bwMax:500, hargaHW:3200000, hargaBW:0, budgetTier:'Low' },
  { kategori:'router', segmen:'SME', nama:'Huawei AR1220E', brand:'Huawei', userMin:20, userMax:100, bwMin:100, bwMax:1000, hargaHW:8500000, hargaBW:0, budgetTier:'Medium' },
  { kategori:'router', segmen:'Enterprise', nama:'Huawei AR6140-16G4XG', brand:'Huawei', userMin:100, userMax:1000, bwMin:500, bwMax:10000, hargaHW:38000000, hargaBW:0, budgetTier:'Medium' },
  { kategori:'router', segmen:'Enterprise', nama:'Juniper MX204 (100G)', brand:'Juniper', userMin:500, userMax:10000, bwMin:5000, bwMax:100000, hargaHW:195000000, hargaBW:0, budgetTier:'High' },
  { kategori:'router', segmen:'Enterprise', nama:'Cisco ASR 1001-HX (100G)', brand:'Cisco', userMin:1000, userMax:50000, bwMin:10000, bwMax:200000, hargaHW:450000000, hargaBW:0, budgetTier:'High' },
  { kategori:'router', segmen:'Enterprise', nama:'Juniper MX304 (400G)', brand:'Juniper', userMin:10000, userMax:200000, bwMin:100000, bwMax:500000, hargaHW:1200000000, hargaBW:0, budgetTier:'High' },
  { kategori:'router', segmen:'Enterprise', nama:'Cisco ASR 9906 Backbone (1T+)', brand:'Cisco', userMin:100000, userMax:1000000, bwMin:400000, bwMax:2000000, hargaHW:5000000000, hargaBW:0, budgetTier:'High' },
  // SERVER
  { kategori:'server', segmen:'SME', nama:'Dell PowerEdge T150', brand:'Dell', userMin:10, userMax:50, hargaHW:28000000, hargaBW:0, budgetTier:'Low' },
  { kategori:'server', segmen:'SME', nama:'HPE ProLiant ML30 Gen10+', brand:'HPE', userMin:20, userMax:100, hargaHW:38000000, hargaBW:0, budgetTier:'High' },
  { kategori:'server', segmen:'SME', nama:'Lenovo ThinkSystem SR250 V2', brand:'Lenovo', userMin:30, userMax:100, hargaHW:45000000, hargaBW:0, budgetTier:'Medium' },
  { kategori:'server', segmen:'Enterprise', nama:'Dell PowerEdge R750', brand:'Dell', userMin:100, userMax:1000, hargaHW:130000000, hargaBW:0, budgetTier:'Medium' },
  { kategori:'server', segmen:'Enterprise', nama:'HPE ProLiant DL380 Gen10+', brand:'HPE', userMin:150, userMax:5000, hargaHW:165000000, hargaBW:0, budgetTier:'High' },
  { kategori:'server', segmen:'Enterprise', nama:'Dell R750 Cluster 2-Node', brand:'Dell', userMin:500, userMax:10000, hargaHW:310000000, hargaBW:0, budgetTier:'High' },
  { kategori:'server', segmen:'Enterprise', nama:'HPE Superdome Flex 280 (DC-Class)', brand:'HPE', userMin:10000, userMax:1000000, hargaHW:2500000000, hargaBW:0, budgetTier:'High' },
  // STORAGE
  { kategori:'storage', segmen:'SME', nama:'Synology DS1522+ 5-Bay', brand:'Synology', userMin:10, userMax:50, hargaHW:19500000, hargaBW:0, budgetTier:'Low' },
  { kategori:'storage', segmen:'SME', nama:'QNAP TS-453D 4-Bay', brand:'QNAP', userMin:15, userMax:100, hargaHW:23500000, hargaBW:0, budgetTier:'Low' },
  { kategori:'storage', segmen:'Enterprise', nama:'Synology RS3621xs+ 12-Bay', brand:'Synology', userMin:100, userMax:1000, hargaHW:60000000, hargaBW:0, budgetTier:'Medium' },
  { kategori:'storage', segmen:'Enterprise', nama:'Dell EMC ME5024 24-Bay SAN', brand:'Dell EMC', userMin:200, userMax:10000, hargaHW:280000000, hargaBW:0, budgetTier:'High' },
  { kategori:'storage', segmen:'Enterprise', nama:'NetApp AFF A250 All-Flash', brand:'NetApp', userMin:500, userMax:50000, hargaHW:680000000, hargaBW:0, budgetTier:'High' },
  { kategori:'storage', segmen:'Enterprise', nama:'NetApp AFF A900 All-Flash (PB-Scale)', brand:'NetApp', userMin:50000, userMax:1000000, hargaHW:5000000000, hargaBW:0, budgetTier:'High' },
  // SWITCH L3
  { kategori:'switch', segmen:'SME', nama:'TP-Link TL-SG3428 L2+', brand:'TP-Link', userMin:20, userMax:80, hargaHW:3800000, hargaBW:0, budgetTier:'Low' },
  { kategori:'switch', segmen:'SME', nama:'Ruijie RG-S2910-24GT4XS-E L3', brand:'Ruijie', userMin:20, userMax:100, hargaHW:8500000, hargaBW:0, budgetTier:'Medium' },
  { kategori:'switch', segmen:'SME', nama:'Huawei S5735-L24T4S L3', brand:'Huawei', userMin:20, userMax:100, hargaHW:9500000, hargaBW:0, budgetTier:'Medium' },
  { kategori:'switch', segmen:'Enterprise', nama:'Ruijie RG-S5750 L3 Core 10G', brand:'Ruijie', userMin:100, userMax:1000, hargaHW:35000000, hargaBW:0, budgetTier:'Medium' },
  { kategori:'switch', segmen:'Enterprise', nama:'Aruba CX 6300M 24SFP Core', brand:'Aruba', userMin:150, userMax:5000, hargaHW:95000000, hargaBW:0, budgetTier:'High' },
  { kategori:'switch', segmen:'Enterprise', nama:'Cisco Catalyst 9300L-48P', brand:'Cisco', userMin:200, userMax:10000, hargaHW:115000000, hargaBW:0, budgetTier:'High' },
  { kategori:'switch', segmen:'Enterprise', nama:'Cisco Nexus 9336C-FX2 (100G)', brand:'Cisco', userMin:5000, userMax:100000, hargaHW:650000000, hargaBW:0, budgetTier:'High' },
  { kategori:'switch', segmen:'Enterprise', nama:'Arista 7060X5 (400G DC Fabric)', brand:'Arista', userMin:50000, userMax:1000000, hargaHW:2800000000, hargaBW:0, budgetTier:'High' },
  // SWITCH L2
  { kategori:'switch_l2', segmen:'SME', nama:'TP-Link TL-SG108E 8P', brand:'TP-Link', userMin:5, userMax:30, hargaHW:350000, hargaBW:0, budgetTier:'Low' },
  { kategori:'switch_l2', segmen:'SME', nama:'TP-Link TL-SG1024 24P', brand:'TP-Link', userMin:15, userMax:100, hargaHW:800000, hargaBW:0, budgetTier:'Low' },
  { kategori:'switch_l2', segmen:'SME', nama:'Ruijie RG-ES226GC 24P L2', brand:'Ruijie', userMin:20, userMax:100, hargaHW:2200000, hargaBW:0, budgetTier:'Low' },
  { kategori:'switch_l2', segmen:'Enterprise', nama:'Cisco CBS250-48T-4G 48P', brand:'Cisco', userMin:80, userMax:1000, hargaHW:8500000, hargaBW:0, budgetTier:'High' },
  { kategori:'switch_l2', segmen:'Enterprise', nama:'Aruba 2530-48G 48P', brand:'Aruba', userMin:100, userMax:5000, hargaHW:18000000, hargaBW:0, budgetTier:'High' },
  { kategori:'switch_l2', segmen:'Enterprise', nama:'Juniper EX2300-24T 24P', brand:'Juniper', userMin:80, userMax:10000, hargaHW:15000000, hargaBW:0, budgetTier:'High' },
  { kategori:'switch_l2', segmen:'Enterprise', nama:'Juniper EX4400-48T (10G Uplink)', brand:'Juniper', userMin:10000, userMax:1000000, hargaHW:85000000, hargaBW:0, budgetTier:'High' },
  // CCTV
  { kategori:'cctv', segmen:'SME', nama:'8CH Hikvision + 8 Cam 2MP', brand:'Hikvision', userMin:5, userMax:30, hargaHW:7500000, hargaBW:0, budgetTier:'Low' },
  { kategori:'cctv', segmen:'SME', nama:'16CH Hikvision + 16 Cam 2MP', brand:'Hikvision', userMin:20, userMax:100, hargaHW:13500000, hargaBW:0, budgetTier:'Low' },
  { kategori:'cctv', segmen:'SME', nama:'16CH Dahua + 16 Cam 4MP', brand:'Dahua', userMin:30, userMax:100, hargaHW:19500000, hargaBW:0, budgetTier:'Low' },
  { kategori:'cctv', segmen:'Enterprise', nama:'32CH Hikvision + 32 Cam 4MP', brand:'Hikvision Pro', userMin:100, userMax:1000, hargaHW:48000000, hargaBW:0, budgetTier:'Medium' },
  { kategori:'cctv', segmen:'Enterprise', nama:'64CH Hikvision NVR + 64 Cam 4MP', brand:'Hikvision Pro', userMin:500, userMax:10000, hargaHW:92000000, hargaBW:0, budgetTier:'Medium' },
  { kategori:'cctv', segmen:'Enterprise', nama:'128CH Milestone + 128 Cam 4MP', brand:'Milestone', userMin:1000, userMax:100000, hargaHW:195000000, hargaBW:0, budgetTier:'High' },
  { kategori:'cctv', segmen:'Enterprise', nama:'Enterprise VMS (1000+ Cam)', brand:'Milestone', userMin:50000, userMax:1000000, hargaHW:1500000000, hargaBW:0, budgetTier:'High' },
  // SDWAN
  { kategori:'sdwan', segmen:'SME', nama:'MikroTik RB4011 SDWAN', brand:'MikroTik', userMin:10, userMax:50, bwMin:50, bwMax:300, hargaHW:4800000, hargaBW:0, budgetTier:'Low' },
  { kategori:'sdwan', segmen:'SME', nama:'Fortinet FortiGate 60F SDWAN', brand:'Fortinet', userMin:10, userMax:100, bwMin:50, bwMax:500, hargaHW:9000000, hargaBW:1300000, budgetTier:'Medium' },
  { kategori:'sdwan', segmen:'Enterprise', nama:'MikroTik CCR2116 SDWAN', brand:'MikroTik', userMin:100, userMax:1000, bwMin:500, bwMax:5000, hargaHW:30000000, hargaBW:0, budgetTier:'Medium' },
  { kategori:'sdwan', segmen:'Enterprise', nama:'Fortinet FortiGate 400F SDWAN', brand:'Fortinet', userMin:500, userMax:5000, bwMin:1000, bwMax:10000, hargaHW:92000000, hargaBW:13000000, budgetTier:'High' },
  { kategori:'sdwan', segmen:'Enterprise', nama:'Cisco Meraki MX125 SDWAN', brand:'Cisco Meraki', userMin:100, userMax:2000, bwMin:500, bwMax:5000, hargaHW:48000000, hargaBW:6500000, budgetTier:'High' },
  { kategori:'sdwan', segmen:'Enterprise', nama:'Cisco Viptela vEdge 5000 (40G+)', brand:'Cisco', userMin:5000, userMax:1000000, bwMin:10000, bwMax:2000000, hargaHW:800000000, hargaBW:80000000, budgetTier:'High' },
  // IPPBX
  { kategori:'ippbx', segmen:'SME', nama:'Grandstream UCM6202', brand:'Grandstream', userMin:5, userMax:50, hargaHW:2800000, hargaBW:0, budgetTier:'Low' },
  { kategori:'ippbx', segmen:'SME', nama:'Grandstream UCM6302A', brand:'Grandstream', userMin:10, userMax:100, hargaHW:3800000, hargaBW:0, budgetTier:'Low' },
  { kategori:'ippbx', segmen:'SME', nama:'Grandstream UCM6308A', brand:'Grandstream', userMin:50, userMax:200, hargaHW:8500000, hargaBW:0, budgetTier:'Low' },
  { kategori:'ippbx', segmen:'Enterprise', nama:'Grandstream UCM6510', brand:'Grandstream', userMin:100, userMax:2000, hargaHW:18000000, hargaBW:0, budgetTier:'Medium' },
  { kategori:'ippbx', segmen:'Enterprise', nama:'Grandstream UCM6510 Cluster HA', brand:'Grandstream', userMin:500, userMax:10000, hargaHW:38000000, hargaBW:0, budgetTier:'Medium' },
  { kategori:'ippbx', segmen:'Enterprise', nama:'Cisco CUCM Cluster (Enterprise)', brand:'Cisco', userMin:5000, userMax:1000000, hargaHW:350000000, hargaBW:0, budgetTier:'High' },
];

// Group devices by kategori for pricing engine
export function getDeviceDB(segmen, devices) {
  const list = devices || DEFAULT_DEVICES;
  const filtered = list.filter(d => d.segmen === segmen);
  return filtered.reduce((acc, d) => {
    if (!acc[d.kategori]) acc[d.kategori] = [];
    acc[d.kategori].push(d);
    return acc;
  }, {});
}
