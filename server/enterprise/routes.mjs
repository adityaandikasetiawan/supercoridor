/**
 * Enterprise API Routes - Pricing, Devices, Quotes, Config
 * Mounted at /api/enterprise/* in the main Express server
 */
import express from 'express';
import { generateRecommendations, DEFAULT_BIAYA_TEKNIS, REGION_COSTS } from './pricing-engine.mjs';
import { DEFAULT_DEVICES, getDeviceDB } from './default-devices.mjs';

export function createEnterpriseRouter(requireAuth, requireSalesAdmin, requireSalesAny, getContentValue, setContentValue) {
  const router = express.Router();

  // ── Devices ─────────────────────────────────────────────────────
  router.get('/devices', requireAuth, async (req, res) => {
    const devices = (await getContentValue('enterprise_devices')) ?? DEFAULT_DEVICES;
    const { kategori, segmen, search } = req.query;
    let filtered = devices.filter(d => d.isActive !== false);
    if (kategori) filtered = filtered.filter(d => d.kategori === kategori);
    if (segmen) filtered = filtered.filter(d => d.segmen === segmen);
    if (search) filtered = filtered.filter(d => d.nama.toLowerCase().includes(search.toLowerCase()));
    res.json(filtered);
  });

  router.get('/devices/:id', requireAuth, async (req, res) => {
    const devices = (await getContentValue('enterprise_devices')) ?? DEFAULT_DEVICES;
    const device = devices.find(d => String(d.id) === req.params.id);
    if (!device) return res.status(404).json({ error: 'Device not found' });
    res.json(device);
  });

  router.post('/devices', requireAuth, requireSalesAdmin, async (req, res) => {
    const devices = (await getContentValue('enterprise_devices')) ?? [...DEFAULT_DEVICES];
    const newDevice = { ...req.body, id: Date.now(), isActive: true, createdAt: new Date().toISOString() };
    devices.push(newDevice);
    await setContentValue('enterprise_devices', devices);
    res.json(newDevice);
  });

  router.put('/devices/:id', requireAuth, requireSalesAdmin, async (req, res) => {
    const devices = (await getContentValue('enterprise_devices')) ?? [...DEFAULT_DEVICES];
    const idx = devices.findIndex(d => String(d.id) === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Device not found' });
    devices[idx] = { ...devices[idx], ...req.body };
    await setContentValue('enterprise_devices', devices);
    res.json(devices[idx]);
  });

  router.delete('/devices/:id', requireAuth, requireSalesAdmin, async (req, res) => {
    const devices = (await getContentValue('enterprise_devices')) ?? [...DEFAULT_DEVICES];
    const idx = devices.findIndex(d => String(d.id) === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Device not found' });
    devices[idx].isActive = false;
    await setContentValue('enterprise_devices', devices);
    res.json({ ok: true });
  });

  router.post('/devices/bulk-import', requireAuth, requireSalesAdmin, async (req, res) => {
    const existing = (await getContentValue('enterprise_devices')) ?? [...DEFAULT_DEVICES];
    const newDevices = (req.body.devices || []).map((d, i) => ({ ...d, id: Date.now() + i, isActive: true, createdAt: new Date().toISOString() }));
    const merged = [...existing, ...newDevices];
    await setContentValue('enterprise_devices', merged);
    res.json({ count: newDevices.length });
  });

  router.get('/devices/export', requireAuth, async (_req, res) => {
    const devices = (await getContentValue('enterprise_devices')) ?? DEFAULT_DEVICES;
    res.json(devices.filter(d => d.isActive !== false));
  });

  router.post('/devices/reset', requireAuth, requireSalesAdmin, async (_req, res) => {
    await setContentValue('enterprise_devices', [...DEFAULT_DEVICES.map((d, i) => ({ ...d, id: i + 1, isActive: true }))]);
    res.json({ count: DEFAULT_DEVICES.length });
  });

  // ── Packages (Paket Fix) ─────────────────────────────────────────
  const DEFAULT_PACKAGES = [
    {
      id: 'pkg-1',
      nama: 'Paket Starter SME',
      deskripsi: 'Paket internet + router untuk bisnis kecil hingga 50 user',
      segmen: 'SME',
      budgetTier: 'Low',
      skema: 'recurring',
      durasiKontrak: 12,
      hargaBulan: 3500000,
      hargaOTC: null,
      perangkat: [
        { nama: 'Dedicated Internet 50 Mbps', brand: 'SuperCorridor', qty: 1, keterangan: 'Bandwidth dedicated 50 Mbps' },
        { nama: 'Router Mikrotik RB750Gr3', brand: 'MikroTik', qty: 1, keterangan: 'Router utama' },
      ],
      fitur: ['SLA 99.9%', 'Support 8x5', 'Monitoring 24/7'],
      services: 'Instalasi & konfigurasi perangkat, managed router, monitoring 24/7, troubleshooting remote',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'pkg-2',
      nama: 'Paket Business',
      deskripsi: 'Internet + firewall + switch untuk bisnis 50-150 user',
      segmen: 'SME',
      budgetTier: 'Medium',
      skema: 'recurring',
      durasiKontrak: 12,
      hargaBulan: 8500000,
      hargaOTC: null,
      perangkat: [
        { nama: 'Dedicated Internet 100 Mbps', brand: 'SuperCorridor', qty: 1, keterangan: 'Bandwidth dedicated 100 Mbps' },
        { nama: 'Firewall Fortinet 60F', brand: 'Fortinet', qty: 1, keterangan: 'Next-gen firewall' },
        { nama: 'Switch Huawei S5735', brand: 'Huawei', qty: 2, keterangan: 'Switch L3 24-port' },
      ],
      fitur: ['SLA 99.95%', 'Support 8x5', 'Monitoring 24/7', 'Managed Firewall'],
      services: 'Instalasi & konfigurasi seluruh perangkat, managed firewall, managed switch, monitoring NOC 24/7, maintenance bulanan, troubleshooting onsite 1x/bulan',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'pkg-3',
      nama: 'Paket Enterprise Plus',
      deskripsi: 'Solusi lengkap internet + keamanan + komunikasi untuk enterprise',
      segmen: 'Enterprise',
      budgetTier: 'High',
      skema: 'recurring',
      durasiKontrak: 24,
      hargaBulan: 25000000,
      hargaOTC: null,
      perangkat: [
        { nama: 'Dedicated Internet 500 Mbps', brand: 'SuperCorridor', qty: 1, keterangan: 'Bandwidth dedicated 500 Mbps' },
        { nama: 'SD-WAN Cisco Meraki MX', brand: 'Cisco Meraki', qty: 1, keterangan: 'SD-WAN controller' },
        { nama: 'Firewall Palo Alto PA-220', brand: 'Palo Alto', qty: 1, keterangan: 'Enterprise firewall' },
        { nama: 'Switch Cisco Catalyst 9300', brand: 'Cisco', qty: 4, keterangan: 'Core switch L3' },
        { nama: 'WiFi Aruba AP-515', brand: 'Aruba', qty: 10, keterangan: 'Access point indoor' },
      ],
      fitur: ['SLA 99.99%', 'Support 24x7', 'NOC Monitoring', 'Managed Services', 'Project Management'],
      services: 'Full managed services: instalasi, konfigurasi, project management 3 bulan, NOC monitoring 24x7, managed firewall & SD-WAN, maintenance onsite 2x/bulan, dedicated account manager, quarterly review meeting',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  router.get('/packages', requireAuth, async (_req, res) => {
    const packages = (await getContentValue('enterprise_packages')) ?? DEFAULT_PACKAGES;
    res.json(packages.filter(p => p.isActive !== false));
  });

  router.get('/packages/all', requireAuth, requireSalesAdmin, async (_req, res) => {
    const packages = (await getContentValue('enterprise_packages')) ?? DEFAULT_PACKAGES;
    res.json(packages);
  });

  router.post('/packages', requireAuth, requireSalesAdmin, async (req, res) => {
    const packages = (await getContentValue('enterprise_packages')) ?? [...DEFAULT_PACKAGES];
    const newPkg = {
      ...req.body,
      id: `pkg-${Date.now()}`,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    packages.push(newPkg);
    await setContentValue('enterprise_packages', packages);
    res.json(newPkg);
  });

  router.put('/packages/:id', requireAuth, requireSalesAdmin, async (req, res) => {
    const packages = (await getContentValue('enterprise_packages')) ?? [...DEFAULT_PACKAGES];
    const idx = packages.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Package not found' });
    packages[idx] = { ...packages[idx], ...req.body, updatedAt: new Date().toISOString() };
    await setContentValue('enterprise_packages', packages);
    res.json(packages[idx]);
  });

  router.delete('/packages/:id', requireAuth, requireSalesAdmin, async (req, res) => {
    const packages = (await getContentValue('enterprise_packages')) ?? [...DEFAULT_PACKAGES];
    const idx = packages.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Package not found' });
    packages[idx].isActive = false;
    await setContentValue('enterprise_packages', packages);
    res.json({ ok: true });
  });

  // ── Pricing / Generate ──────────────────────────────────────────
  router.post('/pricing/generate', requireAuth, async (req, res) => {
    const params = req.body;
    if (!params.segmen || !params.selectedSolusi || !params.selectedSolusi.length) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Load devices - include all active devices, prefer selected segmen (sorted first)
    const allDevices = (await getContentValue('enterprise_devices')) ?? DEFAULT_DEVICES;
    const activeDevices = allDevices.filter(d => d.isActive !== false);
    const deviceDB = activeDevices.reduce((acc, d) => {
      if (!acc[d.kategori]) acc[d.kategori] = [];
      acc[d.kategori].push(d);
      return acc;
    }, {});
    // Sort each category: preferred segmen first
    for (const cat of Object.keys(deviceDB)) {
      deviceDB[cat].sort((a, b) => {
        if (a.segmen === params.segmen && b.segmen !== params.segmen) return -1;
        if (a.segmen !== params.segmen && b.segmen === params.segmen) return 1;
        return 0;
      });
    }

    // Load biaya teknis config
    const biayaTeknisCfg = (await getContentValue('enterprise_biaya_teknis')) ?? DEFAULT_BIAYA_TEKNIS;

    const recommendations = generateRecommendations({ ...params, biayaTeknisCfg }, deviceDB);

    if (!recommendations.length) {
      return res.json({ recommendations: [], message: 'Tidak ada kombinasi yang cocok dengan parameter ini.' });
    }

    res.json({ recommendations, count: recommendations.length });
  });

  // ── Quotes ──────────────────────────────────────────────────────
  router.get('/quotes', requireAuth, async (req, res) => {
    const quotes = (await getContentValue('enterprise_quotes')) ?? [];
    // sales_admin and super_admin can see all quotes, regular sales sees only their own
    const userQuotes = req.auth.role === 'super_admin' || req.auth.role === 'sales_admin' || req.auth.role === 'manager'
      ? quotes
      : quotes.filter(q => q.userId === req.auth.userId);
    res.json(userQuotes);
  });

  router.get('/quotes/:id', requireAuth, async (req, res) => {
    const quotes = (await getContentValue('enterprise_quotes')) ?? [];
    const quote = quotes.find(q => q.id === req.params.id);
    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    res.json(quote);
  });

  router.post('/quotes', requireAuth, async (req, res) => {
    const quotes = (await getContentValue('enterprise_quotes')) ?? [];
    const newQuote = {
      ...req.body,
      id: `Q-${Date.now()}`,
      userId: req.auth.userId,
      userName: req.auth.name,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    quotes.unshift(newQuote);
    await setContentValue('enterprise_quotes', quotes);
    res.json(newQuote);
  });

  router.put('/quotes/:id', requireAuth, async (req, res) => {
    const quotes = (await getContentValue('enterprise_quotes')) ?? [];
    const idx = quotes.findIndex(q => q.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Quote not found' });
    quotes[idx] = { ...quotes[idx], ...req.body, updatedAt: new Date().toISOString() };
    await setContentValue('enterprise_quotes', quotes);
    res.json(quotes[idx]);
  });

  router.delete('/quotes/:id', requireAuth, async (req, res) => {
    let quotes = (await getContentValue('enterprise_quotes')) ?? [];
    quotes = quotes.filter(q => q.id !== req.params.id);
    await setContentValue('enterprise_quotes', quotes);
    res.json({ ok: true });
  });

  router.post('/quotes/:id/generate', requireAuth, async (req, res) => {
    const quotes = (await getContentValue('enterprise_quotes')) ?? [];
    const idx = quotes.findIndex(q => q.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Quote not found' });

    const quote = quotes[idx];
    const allDevices = (await getContentValue('enterprise_devices')) ?? DEFAULT_DEVICES;
    const activeDevices = allDevices.filter(d => d.isActive !== false);
    const deviceDB = activeDevices.reduce((acc, d) => {
      if (!acc[d.kategori]) acc[d.kategori] = [];
      acc[d.kategori].push(d);
      return acc;
    }, {});
    for (const cat of Object.keys(deviceDB)) {
      deviceDB[cat].sort((a, b) => {
        if (a.segmen === quote.segmen && b.segmen !== quote.segmen) return -1;
        if (a.segmen !== quote.segmen && b.segmen === quote.segmen) return 1;
        return 0;
      });
    }

    const biayaTeknisCfg = (await getContentValue('enterprise_biaya_teknis')) ?? DEFAULT_BIAYA_TEKNIS;
    const recommendations = generateRecommendations({ ...quote, biayaTeknisCfg }, deviceDB);

    if (!recommendations.length) {
      return res.json({ quote, recommendations: [], message: 'Tidak ada kombinasi yang cocok.' });
    }

    // Save first recommendation as calculation
    quotes[idx].calculation = recommendations[0];
    quotes[idx].updatedAt = new Date().toISOString();
    await setContentValue('enterprise_quotes', quotes);

    res.json({ quote: quotes[idx], recommendations });
  });

  router.post('/quotes/:id/submit', requireAuth, async (req, res) => {
    const quotes = (await getContentValue('enterprise_quotes')) ?? [];
    const idx = quotes.findIndex(q => q.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Quote not found' });
    quotes[idx].status = 'submitted';
    quotes[idx].updatedAt = new Date().toISOString();
    await setContentValue('enterprise_quotes', quotes);
    res.json(quotes[idx]);
  });

  router.post('/quotes/:id/approve', requireAuth, requireSalesAdmin, async (req, res) => {
    const quotes = (await getContentValue('enterprise_quotes')) ?? [];
    const idx = quotes.findIndex(q => q.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Quote not found' });
    const { approved, note } = req.body;
    quotes[idx].status = approved ? 'approved' : 'rejected';
    quotes[idx].approvedBy = req.auth.name;
    quotes[idx].approvalNote = note || '';
    quotes[idx].updatedAt = new Date().toISOString();
    await setContentValue('enterprise_quotes', quotes);
    res.json(quotes[idx]);
  });

  // ── Config (Biaya Teknis) ───────────────────────────────────────
  router.get('/config/biaya-teknis', requireAuth, async (_req, res) => {
    const config = (await getContentValue('enterprise_biaya_teknis')) ?? DEFAULT_BIAYA_TEKNIS;
    res.json(config);
  });

  router.put('/config/biaya-teknis', requireAuth, requireSalesAdmin, async (req, res) => {
    await setContentValue('enterprise_biaya_teknis', req.body);
    res.json(req.body);
  });

  router.post('/config/biaya-teknis/reset', requireAuth, requireSalesAdmin, async (_req, res) => {
    await setContentValue('enterprise_biaya_teknis', DEFAULT_BIAYA_TEKNIS);
    res.json(DEFAULT_BIAYA_TEKNIS);
  });

  router.get('/config/region-costs', requireAuth, async (_req, res) => {
    res.json(REGION_COSTS);
  });

  // ── Categories ──────────────────────────────────────────────────
  const DEFAULT_CATEGORIES = [
    { id: 'internet', label: 'Internet', icon: 'Globe' },
    { id: 'router', label: 'Router', icon: 'Router' },
    { id: 'sdwan', label: 'SD-WAN', icon: 'Network' },
    { id: 'firewall', label: 'Firewall', icon: 'Shield' },
    { id: 'cctv', label: 'CCTV', icon: 'Camera' },
    { id: 'wifi', label: 'WiFi', icon: 'Wifi' },
    { id: 'switch', label: 'Switch L3', icon: 'Layers' },
    { id: 'switch_l2', label: 'Switch L2', icon: 'Layers' },
    { id: 'server', label: 'Server', icon: 'Server' },
    { id: 'storage', label: 'Storage', icon: 'HardDrive' },
    { id: 'ippbx', label: 'IP-PBX', icon: 'Phone' },
    { id: 'kabel', label: 'Kabel', icon: 'Cable' },
  ];

  router.get('/categories', requireAuth, async (_req, res) => {
    const categories = (await getContentValue('enterprise_categories')) ?? DEFAULT_CATEGORIES;
    res.json(categories);
  });

  router.post('/categories', requireAuth, requireSalesAdmin, async (req, res) => {
    const { id, label, icon } = req.body;
    if (!id || !label) return res.status(400).json({ error: 'id and label required' });
    const categories = (await getContentValue('enterprise_categories')) ?? [...DEFAULT_CATEGORIES];
    if (categories.find(c => c.id === id)) return res.status(400).json({ error: 'Category ID already exists' });
    categories.push({ id: id.toLowerCase().replace(/[^a-z0-9_]/g, '_'), label, icon: icon || 'Box' });
    await setContentValue('enterprise_categories', categories);
    res.json(categories);
  });

  router.put('/categories/:id', requireAuth, requireSalesAdmin, async (req, res) => {
    const { label, icon } = req.body;
    const categories = (await getContentValue('enterprise_categories')) ?? [...DEFAULT_CATEGORIES];
    const idx = categories.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Category not found' });
    if (label) categories[idx].label = label;
    if (icon) categories[idx].icon = icon;
    await setContentValue('enterprise_categories', categories);
    res.json(categories);
  });

  router.delete('/categories/:id', requireAuth, requireSalesAdmin, async (req, res) => {
    const categories = (await getContentValue('enterprise_categories')) ?? [...DEFAULT_CATEGORIES];
    const filtered = categories.filter(c => c.id !== req.params.id);
    await setContentValue('enterprise_categories', filtered);
    res.json(filtered);
  });

  return router;
}
