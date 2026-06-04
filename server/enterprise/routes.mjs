/**
 * Enterprise API Routes - Pricing, Devices, Quotes, Config
 * Mounted at /api/enterprise/* in the main Express server
 */
import express from 'express';
import { generateRecommendations, DEFAULT_BIAYA_TEKNIS, REGION_COSTS } from './pricing-engine.mjs';
import { DEFAULT_DEVICES, getDeviceDB } from './default-devices.mjs';

export function createEnterpriseRouter(requireAuth, requireSalesAdmin, getContentValue, setContentValue) {
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

  // ── Pricing / Generate ──────────────────────────────────────────
  router.post('/pricing/generate', requireAuth, async (req, res) => {
    const params = req.body;
    if (!params.segmen || !params.selectedSolusi || !params.selectedSolusi.length) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Load devices
    const allDevices = (await getContentValue('enterprise_devices')) ?? DEFAULT_DEVICES;
    const activeDevices = allDevices.filter(d => d.isActive !== false);
    const deviceDB = activeDevices.reduce((acc, d) => {
      if (d.segmen !== params.segmen) return acc;
      if (!acc[d.kategori]) acc[d.kategori] = [];
      acc[d.kategori].push(d);
      return acc;
    }, {});

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
    // Filter by user role
    const userQuotes = req.auth.role === 'super_admin' || req.auth.role === 'manager'
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
      if (d.segmen !== quote.segmen) return acc;
      if (!acc[d.kategori]) acc[d.kategori] = [];
      acc[d.kategori].push(d);
      return acc;
    }, {});

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

  router.post('/quotes/:id/approve', requireAuth, async (req, res) => {
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
