# Interactive Network Coverage Map — Konsep & Spesifikasi

> Status: **READY TO EXECUTE**  
> File terkait: `pages/NetworkCoverage.tsx`, `pages/admin/NetworkCoverage.tsx`  
> Referensi visual: Gambar peta jaringan fiber Indonesia (jalur subsea + inland)

---

## Overview

Mengganti section Coverage Map yang saat ini statis (gambar/iframe) menjadi **peta interaktif animasi** dengan layer SVG di atas background gambar peta. Admin dapat mengelola semua elemen peta (gambar, pin kota, jalur kabel, legend) langsung dari panel admin tanpa perlu menyentuh kode.

---

## Pendekatan Teknis: Opsi A

**SVG overlay di atas `<img>` background**

- Gambar peta (PNG/WebP/SVG) sebagai background statis
- Layer `<svg>` transparan di atasnya untuk render marker dan jalur
- Koordinat pin dan jalur disimpan dalam `%` (relatif ukuran gambar) → responsif di semua screen
- Pure SVG + CSS Animation + React state — **tidak butuh library eksternal**
- Admin upload gambar baru kapan saja → overlay tetap bekerja

---

## Behavior Animasi

### Saat halaman pertama kali dibuka (auto-play):

1. Background peta muncul (`fade in`)
2. Pin kota muncul satu per satu dengan `bounce` / `scale` animation (staggered delay)
3. Garis jalur "tumbuh" dari titik awal ke titik akhir — efek kabel sedang ditarik (`stroke-dashoffset` animation)
4. Semua jalur beranimasi sekaligus (existing, progress, plan)
5. Setelah semua muncul → masuk **idle state**:
   - Pin kota: `pulse ring` terus berputar
   - Garis subsea: `stroke-dashoffset` flow (sinyal mengalir)
   - Garis plan (putus-putus): `opacity blink` pelan

### Saat user klik kota di sidebar kiri:

1. Kota yang diklik → highlight (pin membesar `scale(1.5)`, warna terang)
2. Semua jalur yang terhubung ke kota itu → highlight (lebih terang, lebih tebal)
3. Jalur lain yang tidak terhubung → dim (`opacity: 0.2`)
4. Sidebar kiri → tampilkan detail info kota:
   - Nama kota & provinsi
   - Jumlah PoPs
   - Status (Active / Coming Soon)
   - Tipe koneksi (Inland / Subsea)
5. Klik lagi atau klik area kosong → kembali ke state semua aktif

---

## Layout Halaman Publik

```
┌─────────────────────────────────────────────────────────────┐
│  HERO: Network & Coverage                                   │
├─────────────────────────────────────────────────────────────┤
│  Stats Cards (Cities / PoPs / Uptime)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────────────────────────────┐ │
│  │ SIDEBAR KIRI │  │  PETA INTERAKTIF                     │ │
│  │              │  │                                      │ │
│  │ [Default]    │  │  [background image]                  │ │
│  │ Semua Region │  │                                      │ │
│  │              │  │  • Pin kota (pulse animation)        │ │
│  │ ──────────── │  │  ━━━━► Existing line (flow anim)     │ │
│  │ > Jakarta    │  │  ----► Plan line (dash blink)        │ │
│  │   Surabaya   │  │  ════► Progress (yellow flow)        │ │
│  │   Medan      │  │                                      │ │
│  │   Makassar   │  │  [Klik pin/kota di sidebar]          │ │
│  │   ...        │  │  → highlight jalur terhubung         │ │
│  │              │  │  → dim jalur lain                    │ │
│  │ [Detail saat │  │  → tooltip/card muncul               │ │
│  │  diklik]     │  │                                      │ │
│  │ 📍 Jakarta   │  └──────────────────────────────────────┘ │
│  │ PoPs: 25     │                                           │
│  │ Status: ✅   │  Legend: ━━ Existing  ---- Plan  ══ Progress │
│  │ Subsea + ILD │                                           │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Animasi per Elemen

| Elemen | Animasi Default (idle) | Saat Di-highlight | Saat Di-dim |
|---|---|---|---|
| Pin kota | `pulse` ring berputar | `scale(1.5)` + warna terang + glow | `opacity: 0.2` |
| Garis Existing Inland | `stroke-dashoffset` flow (biru) | lebih terang, `stroke-width` 2x | `opacity: 0.15` |
| Garis Existing Subsea | `stroke-dashoffset` flow (biru tebal) | lebih terang, glow effect | `opacity: 0.15` |
| Garis Plan Inland | `opacity blink` putus-putus oranye | solid + lebih terang | `opacity: 0.1` |
| Garis Plan Subsea | `opacity blink` putus-putus biru | solid + lebih terang | `opacity: 0.1` |
| Garis Progress Subsea | flow kuning bergerak cepat | lebih cepat + glow kuning | `opacity: 0.15` |

---

## Data Model

### Update `CoverageCity` (tambahan field baru):

```typescript
interface CoverageCity {
  // existing fields:
  id: string;
  name: string;
  province: string;
  pops: number;
  status: 'active' | 'coming-soon';

  // NEW fields:
  x: number;                              // 0-100 (% dari kiri gambar peta)
  y: number;                              // 0-100 (% dari atas gambar peta)
  iconType: 'dot' | 'star' | 'diamond' | 'tower';
  iconColor: 'red' | 'yellow' | 'blue' | 'green' | 'white';
  connectionType: 'inland' | 'subsea' | 'both';
}
```

### Interface baru `NetworkRoute`:

```typescript
interface NetworkRoute {
  id: string;
  fromCityId: string;
  toCityId: string;
  type:
    | 'existing-inland'
    | 'existing-subsea'
    | 'plan-inland'
    | 'plan-subsea'
    | 'progress-subsea';
  waypoints: { x: number; y: number }[]; // titik belok jalur (% koordinat)
}
```

### Interface baru `LegendItem`:

```typescript
interface LegendItem {
  id: string;
  label: string;
  lineType: 'solid' | 'dashed';
  color: string;   // hex color
}
```

### Update payload API `/api/admin/content/network-coverage`:

```typescript
{
  networkCoverage: {
    // existing:
    title, description, totalPops, totalCities,
    mapImage, mapEmbedUrl, mapApiKey,
    cities,     // CoverageCity[] — sekarang include x, y, iconType, dll
    stats,
    infrastructure,

    // NEW:
    routes: NetworkRoute[];
    legend: LegendItem[];
  }
}
```

---

## Komponen yang Akan Dibuat / Diupdate

### Komponen Baru

| File | Deskripsi |
|---|---|
| `components/InteractiveNetworkMap.tsx` | Komponen utama halaman publik: background img + SVG overlay + semua animasi + interaksi klik |
| `components/admin/MapPinEditor.tsx` | Preview peta klikable di admin untuk set posisi X/Y tiap kota |
| `components/admin/RouteEditor.tsx` | Form tambah/edit/hapus routes + waypoints |

### File yang Diupdate

| File | Perubahan |
|---|---|
| `pages/NetworkCoverage.tsx` | Ganti section Coverage Map dengan `<InteractiveNetworkMap />` + tambah sidebar kiri |
| `pages/admin/NetworkCoverage.tsx` | Tambah section: Map Pin Editor, Route Editor, Legend Editor |

---

## Detail Admin Panel (Tambahan Sections)

### Section: Map Pin Positions

```
┌─────────────────────────────────────────────────────┐
│  📍 Map Pin Positions                               │
│                                                     │
│  Preview Peta (klikable):                           │
│  ┌─────────────────────────────────────────────┐   │
│  │  Mode: ○ View  ● Set Position               │   │
│  │  Kota: [Jakarta                    ▼]       │   │
│  │                                             │   │
│  │  [klik di peta untuk set posisi]            │   │
│  │  (cursor: crosshair)                        │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Posisi: X: [23.4]%   Y: [67.2]%   [Reset]         │
│  Icon: [dot ▼]   Warna: [red ▼]                     │
│  Koneksi: [both ▼]                                  │
│                                                     │
│  [Simpan Posisi]                                    │
└─────────────────────────────────────────────────────┘
```

### Section: Network Routes

```
┌─────────────────────────────────────────────────────┐
│  🔗 Network Routes           [+ Tambah Route]       │
│                                                     │
│  Route #1                                  [Delete] │
│  Dari: [Jakarta ▼]  Ke: [Surabaya ▼]               │
│  Tipe: [existing-inland ▼]                          │
│  Waypoints: (opsional, untuk jalur tidak lurus)     │
│    Titik 1: X [___]%  Y [___]%  [✕]               │
│    [+ Tambah Waypoint]                              │
│                                                     │
│  Route #2                                  [Delete] │
│  Dari: [Jakarta ▼]  Ke: [Medan ▼]                  │
│  Tipe: [existing-subsea ▼]                          │
│                                                     │
│  [Simpan Routes]                                    │
└─────────────────────────────────────────────────────┘
```

### Section: Legend Editor

```
┌─────────────────────────────────────────────────────┐
│  📋 Legend                   [+ Tambah Item]        │
│                                                     │
│  Item #1:                                  [Delete] │
│  Label: [Progress Subsea    ]                       │
│  Tipe: [solid ▼]  Warna: [#FFD700    ]             │
│                                                     │
│  Item #2:                                  [Delete] │
│  Label: [Existing Inland    ]                       │
│  Tipe: [solid ▼]  Warna: [#3B82F6    ]             │
│                                                     │
│  [Simpan Legend]                                    │
└─────────────────────────────────────────────────────┘
```

---

## Fallback Behavior

| Kondisi | Tampilan |
|---|---|
| Tidak ada `mapImage` & tidak ada `mapEmbedUrl` | Placeholder existing (Globe icon + teks) |
| Ada `mapEmbedUrl` | Tampilkan iframe Google Maps (existing) |
| Ada `mapImage` tapi tidak ada `routes`/`cities` dengan koordinat | Tampilkan gambar statis saja |
| Ada `mapImage` + ada `routes` + ada `cities` dengan koordinat | Tampilkan peta interaktif animasi penuh |

---

## Urutan Eksekusi (Checklist)

- [x] **Step 1:** Buat `components/InteractiveNetworkMap.tsx` ✅
- [x] **Step 2:** Update `pages/NetworkCoverage.tsx` ✅
- [x] **Step 3:** Buat `components/admin/MapPinEditor.tsx` ✅
- [x] **Step 4:** Buat `components/admin/RouteEditor.tsx` + `LegendEditor` ✅
- [x] **Step 5:** Update `pages/admin/NetworkCoverage.tsx` ✅
- [x] **Step 6:** Interface data & payload API updated ✅

**Status: COMPLETE — Zero TypeScript errors**

---

## Catatan Teknis

- Koordinat semua elemen dalam `%` bukan pixel → otomatis responsif
- CSS animations menggunakan `@keyframes` di `<style>` tag dalam komponen (tidak perlu global CSS)
- Untuk waypoints, path dirender sebagai SVG `<path d="M x1,y1 L wx,wy L x2,y2">` atau cubic bezier `C` untuk jalur lengkung
- State interaksi: `selectedCityId: string | null` — null berarti semua aktif
- Tidak ada breaking change — semua field baru opsional, fallback ke behavior lama jika data tidak ada
