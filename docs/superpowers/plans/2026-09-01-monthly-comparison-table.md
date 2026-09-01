# Monthly Comparison Table (BDG vs SMG vs Nasional) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menambahkan tabel Flat Comparison Monthly (Juli 2026) untuk komparasi performa Nasional, Bandung (BDG), dan Semarang (SMG) pada tab Call Center dan e-Care, ditempatkan di atas section Revenue.

**Architecture:** Mengambil data bulan Juli dari sheet `Monthly - CallCenter` dan `Monthly - Ecare` via GViz CSV parser, memetakan data ke model `MonthlyKpiRow[]`, dan menampilkannya dengan komponen `MonthlyComparisonTable` di atas list KPI harian pada `KpiDashboardClient`.

**Tech Stack:** Next.js (App Router), TypeScript, React, Tailwind CSS / Vanilla CSS Variables, SWR.

## Global Constraints
- Target sheet: `Monthly - CallCenter` dan `Monthly - Ecare`.
- Bulan target: Juli (`Jul-26`).
- Kolom: No, Parameter, Definisi, Target, Bobot, Nasional (Ach, Ach to Target, Score), BDG (Ach, Score), SMG (Ach, Score).
- Kolom UIC dan Sumber Data dihilangkan.
- Letak: Di atas section Revenue.

---

### Task 1: Update Data Types & Mock Data

**Files:**
- Modify: `lib/types.ts`
- Modify: `lib/mockDataNew.ts`

**Interfaces:**
- Produces: `MonthlyKpiRow`, updated `TabData` with `monthlyComparison?: MonthlyKpiRow[]`

- [ ] **Step 1: Update `lib/types.ts` with `MonthlyKpiRow` interface**
- [ ] **Step 2: Update `lib/mockDataNew.ts` with mock data for monthly comparison**
- [ ] **Step 3: Verify TypeScript compilation**

---

### Task 2: Implement Sheet Fetching & Parser in `lib/kpiMapper.ts`

**Files:**
- Modify: `lib/kpiMapper.ts`

**Interfaces:**
- Consumes: `MonthlyKpiRow`, `TabData`
- Produces: `parseMonthlyComparison`, updated `getKpiData()`

- [ ] **Step 1: Add robust multi-line CSV parser and `parseMonthlyComparison` helper**
- [ ] **Step 2: Update `getKpiData()` to fetch `Monthly - CallCenter` and `Monthly - Ecare` and map to `monthlyComparison`**
- [ ] **Step 3: Run node scratch test to verify mapper returns complete data for both tabs**

---

### Task 3: Build `MonthlyComparisonTable` Component

**Files:**
- Create: `components/MonthlyComparisonTable.tsx`

**Interfaces:**
- Consumes: `MonthlyKpiRow[]`
- Produces: `<MonthlyComparisonTable rows={currentTabData.monthlyComparison} />`

- [ ] **Step 1: Create `components/MonthlyComparisonTable.tsx` with responsive layout, sticky columns, grouped headers, and badges**
- [ ] **Step 2: Handle Category rows, sub-rows, and Total summary row styling**

---

### Task 4: Integrate Table into Dashboard UI

**Files:**
- Modify: `app/dashboard/KpiDashboardClient.tsx`

**Interfaces:**
- Consumes: `MonthlyComparisonTable`

- [ ] **Step 1: Import and render `MonthlyComparisonTable` above Revenue sections in `app/dashboard/KpiDashboardClient.tsx`**
- [ ] **Step 2: Test switching tabs between Call Center and e-Care**

---

### Task 5: Build Verification & Vercel Deployment

**Files:**
- Modify/Deploy: Vercel deployment scripts / push

- [ ] **Step 1: Run `npm run build` to verify clean build without TypeScript/lint errors**
- [ ] **Step 2: Commit changes to Git**
- [ ] **Step 3: Deploy to Vercel production and verify live deployment**
