/**
 * Pricing Engine - Ported from NestJS to plain JavaScript
 * Handles cost calculation, margin calculation, and recommendation generation
 */

// ── Region Costs ──────────────────────────────────────────────────
export const REGION_COSTS = {
  JABOTABEK:  { delivery: 500000,  instalasi: 1500000, teknisi: 800000  },
  BANTEN:     { delivery: 600000,  instalasi: 1700000, teknisi: 850000  },
  JABAR:      { delivery: 700000,  instalasi: 1800000, teknisi: 900000  },
  JATENG:     { delivery: 750000,  instalasi: 1900000, teknisi: 950000  },
  JATIM:      { delivery: 800000,  instalasi: 2000000, teknisi: 1000000 },
  KALIMANTAN: { delivery: 2500000, instalasi: 3500000, teknisi: 1500000 },
  SULAWESI:   { delivery: 1800000, instalasi: 3000000, teknisi: 1400000 },
  BALI:       { delivery: 900000,  instalasi: 2200000, teknisi: 1100000 },
};

export const DEFAULT_BIAYA_TEKNIS = {
  kabelRate:   15000,
  instalasi:   1500000,
  delivery:    500000,
  managedRate: 500000,
  pmRate:      15000000,
  operasionalPct: 10,  // percentage of total HW cost for perjalanan + operasional
};

// ── Cost Engine ───────────────────────────────────────────────────
export function getBiayaTeknis(params, cfg) {
  const rc = REGION_COSTS[params.region] || REGION_COSTS.JABOTABEK;
  // Use cable device hargaPerMeter if provided, otherwise fall back to config kabelRate
  const kabelRate = (params.kabelHargaPerMeter && params.kabelHargaPerMeter > 0)
    ? params.kabelHargaPerMeter
    : cfg.kabelRate;
  
  // One-time / Instalasi costs
  const bKabel      = params.jarakKabel * kabelRate;
  const bInstalasi  = cfg.instalasi || rc.instalasi;
  const bDelivery   = cfg.delivery || rc.delivery;
  const bAkomodasi  = params.jarakKota > 100
    ? Math.floor((params.jarakKota - 100) / 100) * rc.teknisi * params.hariKerja
    : 0;
  const totalInstalasi = bKabel + bInstalasi + bDelivery + bAkomodasi;

  // Recurring costs (per bulan)
  const bManaged    = cfg.managedRate;  // per bulan
  const bPM         = cfg.pmRate;       // per bulan (only for durasiPM months)

  // Total recurring over contract period
  const totalManagedKontrak = bManaged * params.durasiKontrak;
  const totalPMKontrak      = bPM * params.durasiPM;
  const totalRecurring      = totalManagedKontrak + totalPMKontrak;

  const operasionalPct = cfg.operasionalPct ?? 10;
  const total = totalInstalasi + totalRecurring;

  return {
    // Instalasi breakdown
    bKabel, bInstalasi, bDelivery, bAkomodasi, totalInstalasi,
    // Recurring breakdown
    bManaged, bPM, totalManagedKontrak, totalPMKontrak, totalRecurring,
    // General
    operasionalPct, total, kabelRate,
  };
}

// ── Margin Engine ─────────────────────────────────────────────────
export function calculateMargin(totalBiaya, hargaHW, hargaBW, params) {
  const { skema, targetMargin, komisiPersen, diskon, jborRate, provisiRate, durasiKontrak, biayaInstalasi, biayaRecurringBulan } = params;
  const divisor = 1 - targetMargin;
  if (divisor <= 0) return null;

  let hargaNet, hargaNetBulan, totalRev, totalCost, comVal, hargaOTC, hargaMRC;
  const comAnnualPct = skema === 'otc' ? provisiRate : jborRate + provisiRate;

  if (skema === 'otc') {
    // Everything as one-time cost
    const comAnnual = provisiRate / 100;
    comVal     = totalBiaya * comAnnual;
    totalCost  = totalBiaya + comVal;
    const raw  = Math.round((totalCost / divisor) / 1000) * 1000;
    hargaNet   = Math.round(raw * (1 - diskon) / 1000) * 1000;
    hargaNetBulan = Math.round(hargaNet / durasiKontrak / 1000) * 1000;
    totalRev   = hargaNet;
    hargaOTC   = hargaNet;
    hargaMRC   = 0;
  } else if (skema === 'otc_mrc') {
    // Split: OTC for instalasi, MRC for recurring
    const otcBase = biayaInstalasi || hargaHW;
    const mrcBase = biayaRecurringBulan || (totalBiaya - otcBase) / durasiKontrak;

    const comAnnual = (jborRate + provisiRate) / 100;

    // OTC pricing
    const otcComVal = otcBase * (provisiRate / 100);
    const otcCost = otcBase + otcComVal;
    const otcRaw = Math.round((otcCost / divisor) / 1000) * 1000;
    hargaOTC = Math.round(otcRaw * (1 - diskon) / 1000) * 1000;

    // MRC pricing
    const mrcComVal = mrcBase * comAnnual;
    const mrcCost = mrcBase + mrcComVal;
    const mrcRaw = Math.round((mrcCost / divisor) / 1000) * 1000;
    hargaMRC = Math.round(mrcRaw * (1 - diskon) / 1000) * 1000;

    hargaNetBulan = hargaMRC;
    hargaNet = hargaOTC + hargaMRC * durasiKontrak;
    totalRev = hargaNet;
    comVal = otcComVal + mrcComVal * durasiKontrak;
    totalCost = totalBiaya + comVal;
  } else {
    // recurring: everything spread monthly
    const comAnnual = (jborRate + provisiRate) / 100;
    comVal = totalBiaya * comAnnual / durasiKontrak;
    const costPerBulan = totalBiaya / durasiKontrak + comVal;
    const raw = Math.round((costPerBulan / divisor) / 1000) * 1000;
    hargaNet  = Math.round(raw * (1 - diskon) / 1000) * 1000;
    hargaNetBulan = hargaNet;
    totalRev  = hargaNet * durasiKontrak;
    totalCost = totalBiaya + comVal * durasiKontrak;
    hargaOTC  = 0;
    hargaMRC  = hargaNetBulan;
  }

  const netMargin  = targetMargin - komisiPersen;
  const komisiRp   = totalRev * komisiPersen;
  const payback    = skema === 'otc'
    ? (hargaNet > 0 ? +(hargaHW / hargaNet * durasiKontrak).toFixed(1) : 999)
    : ((hargaNetBulan - hargaBW) > 0 ? +(hargaHW / (hargaNetBulan - hargaBW)).toFixed(1) : 999);

  return { hargaNet, hargaNetBulan, hargaOTC: hargaOTC || 0, hargaMRC: hargaMRC || 0, totalRev, totalCost, margin: netMargin, komisiRp, comVal, comAnnualPct, payback };
}

// ── Budget Tier ───────────────────────────────────────────────────
const BUDGET_TIER_MAP = {
  'TP-Link':'Low', 'Ubiquiti':'Low', 'Grandstream':'Low', 'Hikvision':'Low',
  'Dahua':'Low', 'Synology':'Low', 'QNAP':'Low',
  'Huawei':'Medium', 'Ruijie':'Medium', 'Fortinet':'Medium', 'Sophos':'Medium',
  'Cisco Meraki':'Medium', 'Dell':'Medium', 'Lenovo':'Medium', 'Hikvision Pro':'Medium',
  'Cisco':'High', 'Juniper':'High', 'Aruba':'High', 'Palo Alto':'High',
  'HPE':'High', 'Dell EMC':'High', 'NetApp':'High',
};

const CCTV_PRICING = {
  rec: { nvr: { Low:{harga:1800000}, Medium:{harga:3500000}, High:{harga:12000000} }, dvr: { Low:{harga:1200000}, Medium:{harga:2500000}, High:{harga:7000000} } },
  cam: { ip: { Low:{harga:450000}, Medium:{harga:850000}, High:{harga:2200000} }, ahd: { Low:{harga:280000}, Medium:{harga:450000}, High:{harga:850000} } },
};
const IPPHONE_PRICING = { Low: { harga: 350000 }, Medium: { harga: 850000 }, High: { harga: 2500000 } };

function getBudgetTier(brand, nama = '') {
  if (brand === 'MikroTik') return nama.includes('CCR') ? 'Medium' : 'Low';
  return BUDGET_TIER_MAP[brand] || 'Medium';
}

// ── Recommendation Engine ─────────────────────────────────────────
export function generateRecommendations(params, deviceDB) {
  const biayaTeknisCfg = params.biayaTeknisCfg || DEFAULT_BIAYA_TEKNIS;
  // Allow client to override operasionalPct per quotation
  if (params.operasionalPct != null && params.operasionalPct >= 0) {
    biayaTeknisCfg.operasionalPct = params.operasionalPct;
  }
  const normalizedParams = {
    ...params,
    biayaTeknisCfg,
    targetMargin: params.targetMargin > 1 ? params.targetMargin / 100 : params.targetMargin,
    komisi: params.komisi > 1 ? params.komisi / 100 : params.komisi,
    diskon: (params.diskon || 0) > 1 ? (params.diskon || 0) / 100 : (params.diskon || 0),
  };

  const biaya = getBiayaTeknis({
    jarakKabel: normalizedParams.jarakKabel,
    jarakKota: normalizedParams.jarakKota,
    hariKerja: normalizedParams.hariKerja,
    durasiKontrak: normalizedParams.durasiKontrak,
    durasiPM: normalizedParams.durasiPM,
    region: normalizedParams.region,
    // Use hargaPerMeter from selected cable device if available
    kabelHargaPerMeter: (() => {
      const kabelDevices = (deviceDB['kabel'] || []).filter(d => d.isActive !== false);
      if (kabelDevices.length > 0 && kabelDevices[0].hargaPerMeter) {
        return kabelDevices[0].hargaPerMeter;
      }
      return null;
    })(),
  }, biayaTeknisCfg);

  // Filter devices per kategori
  const lists = {};
  for (const sol of normalizedParams.selectedSolusi) {
    // First try strict match (user range + bandwidth range)
    let matches = (deviceDB[sol] || []).filter(d =>
      d.userMin <= normalizedParams.jumlahUser && d.userMax >= normalizedParams.jumlahUser &&
      (d.bwMax === 0 || d.bwMax === undefined || (d.bwMin <= normalizedParams.bandwidthTarget && d.bwMax >= normalizedParams.bandwidthTarget))
    );
    // Fallback: if no strict match, try matching only bandwidth (pick highest userMax device)
    if (matches.length === 0) {
      matches = (deviceDB[sol] || []).filter(d =>
        (d.bwMax === 0 || d.bwMax === undefined || (d.bwMin <= normalizedParams.bandwidthTarget && d.bwMax >= normalizedParams.bandwidthTarget))
      );
    }
    // Fallback: if still no match, try matching only user range
    if (matches.length === 0) {
      matches = (deviceDB[sol] || []).filter(d =>
        d.userMin <= normalizedParams.jumlahUser && d.userMax >= normalizedParams.jumlahUser
      );
    }
    // Final fallback: pick the device with the highest capacity in this category
    if (matches.length === 0) {
      const allInCat = deviceDB[sol] || [];
      if (allInCat.length > 0) {
        const sorted = [...allInCat].sort((a, b) => (b.userMax || 0) - (a.userMax || 0));
        matches = [sorted[0]];
      }
    }
    if (normalizedParams.budgetTierFilter !== 'All') {
      const tierFiltered = matches.filter(d => getBudgetTier(d.brand, d.nama) === normalizedParams.budgetTierFilter);
      if (tierFiltered.length > 0) matches = tierFiltered;
    }
    if (matches.length > 0) lists[sol] = matches.slice(0, 4);
  }

  const activeSolusi = normalizedParams.selectedSolusi.filter(s => lists[s]);
  if (!activeSolusi.length) return [];

  // Build combinations (cartesian product, max 500)
  let combos = [{}];
  for (const sol of activeSolusi) {
    const newCombos = [];
    for (const combo of combos) {
      for (const item of lists[sol]) {
        newCombos.push({ ...combo, [sol]: item });
      }
    }
    combos = newCombos.slice(0, 500);
  }

  // Calculate each combination
  const tierKey = normalizedParams.targetMargin >= 0.45 ? 'High' : normalizedParams.targetMargin >= 0.30 ? 'Medium' : 'Low';
  const results = [];

  for (const combo of combos) {
    let hargaHW = 0, hargaBW = 0;
    const brandList = [];
    const solutionText = [];
    const qtyMap = normalizedParams.qtyMap || {};
    const cctvCfg = normalizedParams.cctvConfig;

    for (const key in combo) {
      const item = combo[key];
      if (!item) continue;

      if (key === 'cctv' && cctvCfg) {
        const recSpec = CCTV_PRICING.rec[cctvCfg.type]?.[tierKey] || CCTV_PRICING.rec.nvr.Low;
        const camType = cctvCfg.type === 'nvr' ? 'ip' : 'ahd';
        const camSpec = CCTV_PRICING.cam[camType]?.[tierKey] || CCTV_PRICING.cam.ip.Low;
        hargaHW += recSpec.harga * cctvCfg.recQty + camSpec.harga * cctvCfg.camQty;
        hargaBW += item.hargaBW || 0;
        if (item.brand) brandList.push(item.brand);
        solutionText.push(`${cctvCfg.type.toUpperCase()} ×${cctvCfg.recQty} + ${cctvCfg.camQty} Cam`);
        continue;
      }

      const qty = key === 'wifi' ? (qtyMap.wifi || 4) : key === 'ippbx' ? (normalizedParams.ippbxConfig?.pbxQty || 1) : qtyMap[key] || 1;
      hargaHW += (item.hargaHW || 0) * qty;
      hargaBW += item.hargaBW || 0;
      if (item.brand) brandList.push(item.brand);
      solutionText.push(qty > 1 ? `${item.nama} ×${qty}` : item.nama);
    }

    // WLC cost
    const wifiCfg = normalizedParams.wifiConfig;
    if (wifiCfg?.mode === 'wlc' && wifiCfg.wlcHarga) {
      hargaHW += wifiCfg.wlcHarga * (wifiCfg.wlcQty || 1);
      solutionText.push(`WLC ×${wifiCfg.wlcQty || 1}`);
    }

    // IP Phone cost
    if (combo['ippbx'] && normalizedParams.ippbxConfig?.phoneQty) {
      const phoneSpec = IPPHONE_PRICING[tierKey];
      hargaHW += phoneSpec.harga * normalizedParams.ippbxConfig.phoneQty;
      solutionText.push(`${normalizedParams.ippbxConfig.phoneQty} × IP Phone`);
    }

    if (!solutionText.length) continue;

    // Calculate operasional as percentage of hardware cost (one-time)
    const bOperasional = Math.round(hargaHW * (biaya.operasionalPct / 100));
    
    // Separate: Instalasi (one-time) vs Recurring (over contract)
    const biayaInstalasi = biaya.totalInstalasi + hargaHW + bOperasional;
    const biayaRecurringTotal = biaya.totalRecurring + (hargaBW * normalizedParams.durasiKontrak);
    const biayaRecurringBulan = biaya.bManaged + biaya.bPM + hargaBW;
    
    const totalBiaya = biayaInstalasi + biayaRecurringTotal;
    const pricing = calculateMargin(totalBiaya, hargaHW, hargaBW, {
      skema: normalizedParams.skema,
      targetMargin: normalizedParams.targetMargin,
      komisiPersen: normalizedParams.komisi,
      diskon: normalizedParams.diskon,
      jborRate: normalizedParams.jborRate,
      provisiRate: normalizedParams.provisiRate,
      durasiKontrak: normalizedParams.durasiKontrak,
      biayaInstalasi,
      biayaRecurringBulan,
    });

    if (!pricing) continue;

    results.push({
      solution: solutionText.join(' + '),
      brand: [...new Set(brandList)].join(' / ') || '-',
      segmen: normalizedParams.segmen,
      skema: normalizedParams.skema,
      ...pricing,
      data: {
        ...biaya, bOperasional, operasionalPct: biaya.operasionalPct,
        hargaHW, hargaBW,
        biayaInstalasi, biayaRecurringTotal, biayaRecurringBulan,
        totalBiaya,
        durasi: normalizedParams.durasiKontrak, durasiPM: normalizedParams.durasiPM,
        region: normalizedParams.region, userCount: normalizedParams.jumlahUser,
        bwTarget: normalizedParams.bandwidthTarget, namaKlien: normalizedParams.namaKlien || '',
        qtyMap, items: combo,
      },
    });
  }

  // Sort by margin desc, deduplicate by brand (max 5)
  results.sort((a, b) => b.margin - a.margin);
  const seenPrimary = new Set();
  const top = [];
  for (const row of results) {
    if (top.length >= 5) break;
    const brands = (row.brand || '-').split(' / ').map(b => b.trim()).filter(Boolean);
    const primaryBrand = [...brands].sort()[0] || '-';
    if (seenPrimary.has(primaryBrand)) continue;
    seenPrimary.add(primaryBrand);
    top.push(row);
  }

  return top;
}
