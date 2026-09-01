# Spec: Monthly Comparison Table (BDG vs SMG vs Nasional)

## Overview
Menambahkan tabel komparasi Monthly (Juli 2026) pada dashboard KPI untuk kedua tab (`Call Center` dan `e-Care`), membandingkan performa antara **Nasional**, **Bandung (BDG)**, dan **Semarang (SMG)**. Tabel diletakkan di atas section **Revenue** sebagai Flat Table utuh dengan kolom Definisi tetap ditampilkan (kolom UIC dan Sumber Data dihilangkan).

---

## 1. Sumber Data & Ekstraksi
1. **Google Sheets Endpoint**:
   - Tab Call Center: Mengambil data dari sheet `Monthly - CallCenter`
   - Tab e-Care: Mengambil data dari sheet `Monthly - Ecare`
2. **Parsing**:
   - Menggunakan parser CSV multi-line yang tangguh terhadap cell Definisi dengan baris ganti (newlines).
   - Mengambil kolom data bulan Juli (`Jul-26`):
     - **No** (Kolom A)
     - **Parameter** (Kolom B)
     - **Definisi** (Kolom C)
     - *(Kolom D: Sumber Data di-exclude)*
     - *(Kolom E: UIC di-exclude)*
     - **Target** (Kolom F)
     - **Bobot** (Kolom G)
     - **Nasional**:
       - *Ach* (Realisasi)
       - *Ach to Target*
       - *Score*
     - **Bandung (BDG)**:
       - *BDG* (Realisasi)
       - *BDG score*
     - **Semarang (SMG)**:
       - *SMG* (Realisasi)
       - *SMG Score*

---

## 2. Struktur Data (`lib/types.ts`)
```typescript
export interface MonthlyKpiRow {
  no: string;
  parameter: string;
  definisi: string;
  target: string;
  bobot: string;
  nasionalAch: string;
  nasionalAchTarget: string;
  nasionalScore: string;
  bdgAch: string;
  bdgScore: string;
  smgAch: string;
  smgScore: string;
  isCategoryRow?: boolean;
  isTotalRow?: boolean;
  isSubRow?: boolean;
}

export interface TabData {
  tabName: string;
  tabKey: string;
  totalAchievement: number;
  sections: KpiSection[];
  summaryHighlight: string[];
  monthlyComparison?: MonthlyKpiRow[];
}
```

---

## 3. Desain Komponen UI (`components/MonthlyComparisonTable.tsx`)
- **Tipe Tampilan**: Flat Table Utuh.
- **Header Bertingkat**:
  - Kolom Utama: `No`, `Parameter`, `Definisi`, `Target`, `Bobot`
  - Group Header Nasional: `Realisasi`, `Ach to Target`, `Score`
  - Group Header Bandung (BDG): `Realisasi`, `Score`
  - Group Header Semarang (SMG): `Realisasi`, `Score`
- **Highlighting & Badging**:
  - Baris Kategori (*Revenue, Customer Experience, Internal Process*) diberi background aksen pembeda.
  - Baris Total diberi background bold/highlight.
  - Cell Skor BDG & SMG diberi visual accent badge untuk memudahkan komparasi cepat (mana yang lebih unggul).
  - Kolom `Definisi` dibatasi lebar maksimal dan dilengkapi text-wrapping yang rapi / tooltip agar tabel tetap proporsional dan mudah dibaca.
- **Penempatan**:
  - Diletakkan di `app/dashboard/KpiDashboardClient.tsx` persis di atas rendering `currentTabData.sections` (di atas Revenue).

---

## 4. Rencana Verifikasi
- Validasi data live dari kedua sheet Google Spreadsheet (`Monthly - CallCenter` dan `Monthly - Ecare`).
- Pastikan fallback mock data juga memiliki struktur `monthlyComparison` yang valid.
- Verifikasi interaksi: perpindahan tab Call Center <-> e-Care memperbarui tabel komparasi secara realtime.
- Cek responsivitas tampilan tabel di light/dark mode.
