// lib/mockDataNew.ts
// Mock data for the redesigned dashboard — Call Center & e-Care tabs
// Data values match the mockup images exactly, including daily sample data for verification

import type { KpiDashboardData } from "./types";

export const mockDashboardData: KpiDashboardData = {
  selectedPeriod: "July 2026",
  tabs: [
    {
      tabName: "Call Center",
      tabKey: "callCenter",
      totalAchievement: 95,
      sections: [
        {
          name: "Revenue",
          weight: 19.52,
          target: 20,
          parameters: [
            {
              name: "Sales Ratio",
              target: "7%",
              dailyValues: { 1: "6.8%", 2: "7.1%", 3: "7.0%", 15: "7.2%", 30: "7.3%", 31: "7.4%" },
              mtdAchievement: "7.2%",
              robotAchievement: "8.0%"
            },
            {
              name: "Retention Rate",
              target: "40%",
              dailyValues: { 1: "39%", 2: "41%", 15: "40.5%", 30: "40%", 31: "42%" },
              mtdAchievement: "40.8%",
              robotAchievement: "42%"
            },
            {
              name: "CAPS Number",
              target: "100%",
              dailyValues: { 1: "100%", 2: "100%", 15: "99.8%", 30: "100%", 31: "100%" },
              mtdAchievement: "99.9%",
              robotAchievement: "100%"
            },
          ],
        },
        {
          name: "Customer Experience",
          weight: 44.82,
          target: 45,
          parameters: [
            { name: "tNPS Mobile", target: "95%", dailyValues: { 1: "94%", 2: "95.5%", 15: "95%", 30: "95.2%", 31: "95.6%" }, mtdAchievement: "95.3%", robotAchievement: "96%" },
            { name: "tNPS Fixed", target: "85%", dailyValues: { 1: "84%", 2: "85%", 15: "85.2%", 30: "84.8%", 31: "85.1%" }, mtdAchievement: "85.0%", robotAchievement: "86%" },
            { name: "Repeat Mobile", target: "6%", dailyValues: { 1: "5.8%", 2: "6.1%", 15: "6.0%", 30: "5.9%", 31: "6.2%" }, mtdAchievement: "6.0%", robotAchievement: "6.5%" },
            { name: "Repeat Fixed", target: "20%", dailyValues: { 1: "19.5%", 2: "20.2%", 15: "20.0%", 30: "20.1%", 31: "20.3%" }, mtdAchievement: "20.1%", robotAchievement: "21%" },
            { name: "FCR Mobile Permintaan", target: "99%", dailyValues: { 1: "99%", 2: "99.1%", 15: "98.9%", 30: "99.2%", 31: "99.3%" }, mtdAchievement: "99.1%", robotAchievement: "99.5%" },
            { name: "FCR Mobile Komplain", target: "66%", dailyValues: { 1: "65.5%", 2: "66.2%", 15: "66.0%", 30: "66.1%", 31: "66.3%" }, mtdAchievement: "66.1%", robotAchievement: "67%" },
            { name: "FCR Fixed Komplain", target: "45%", dailyValues: { 1: "44.8%", 2: "45.2%", 15: "45.0%", 30: "45.1%", 31: "45.3%" }, mtdAchievement: "45.1%", robotAchievement: "46%" },
            { name: "FCR Fixed Reciprocal", target: "81%", dailyValues: { 1: "80.5%", 2: "81.2%", 15: "81.0%", 30: "81.1%", 31: "81.3%" }, mtdAchievement: "81.1%", robotAchievement: "82%" },
          ],
        },
        {
          name: "Internal Process",
          weight: 33.62,
          target: 35,
          parameters: [
            { name: "Service Level", target: "96%", dailyValues: { 1: "96.2%", 2: "95.8%" }, mtdAchievement: "96.0%", robotAchievement: "96.5%" },
            { name: "Regular", target: "96%", isSubRow: true, dailyValues: { 1: "96%", 2: "95.5%" }, mtdAchievement: "95.8%", robotAchievement: "96%" },
            { name: "Priority", target: "96%", isSubRow: true, dailyValues: { 1: "96.5%", 2: "96.1%" }, mtdAchievement: "96.3%", robotAchievement: "96.8%" },
            { name: "357", target: "96%", isSubRow: true, dailyValues: { 1: "96%", 2: "96%" }, mtdAchievement: "96.0%", robotAchievement: "96%" },
            { name: "byU", target: "96%", isSubRow: true, dailyValues: { 1: "95.8%", 2: "96.2%" }, mtdAchievement: "96.1%", robotAchievement: "96.4%" },
            { name: "Video Call", target: "96%", isSubRow: true, dailyValues: { 1: "96.1%", 2: "96%" }, mtdAchievement: "96.0%", robotAchievement: "96.2%" },
            { name: "Ticket SLA Mobile", target: "95%", dailyValues: { 1: "95%", 2: "95.2%", 30: "94.8%" }, mtdAchievement: "95.1%", robotAchievement: "95.5%" },
            { name: "Ticket SLA Fixed", target: "96,5%", dailyValues: { 1: "96.5%", 2: "96.7%", 30: "96.4%" }, mtdAchievement: "96.5%", robotAchievement: "97%" },
            { name: "Close rate ticket Mobile", target: "98%", dailyValues: { 1: "98%", 2: "98.1%", 30: "97.9%" }, mtdAchievement: "98.0%", robotAchievement: "98.5%" },
          ],
        },
      ],
      summaryHighlight: [
        "Pencapaian KPI Call Center bulan ini stabil di angka 95%.",
        "tNPS Mobile mencapai target 95.3% berkat kampanye perbaikan respon awal.",
        "Internal Process Service Level mencapai target 96% untuk semua segmen.",
        "FCR Mobile Komplain perlu perhatian ekstra agar mencapai target 66% secara konsisten.",
        "Ticket SLA Fixed melampaui target bulanan di angka 96.5%.",
        "Close rate ticket Mobile stabil di 98% selama 3 periode berturut-turut.",
        "Kinerja byU dan Video Call tetap terjaga di atas batas minimum SLA.",
        "Sales Ratio di area Revenue berkontribusi positif sebesar 7.2% dari target 7%."
      ],
      monthlyComparison: [
        { no: "1", parameter: "Revenue", definisi: "", target: "", bobot: "20%", nasionalAch: "", nasionalAchTarget: "", nasionalScore: "15.59%", bdgAch: "", bdgScore: "16.35%", smgAch: "", smgScore: "13.84%", isCategoryRow: true },
        { no: "1", parameter: "Sales Interaction Ratio (SIR)", definisi: "Proporsi interaksi yang menghasilkan Sales dibandingkan seluruh interaksi yang ditangani oleh Agent.", target: "7%", bobot: "5%", nasionalAch: "5.88%", nasionalAchTarget: "84.00%", nasionalScore: "4.20%", bdgAch: "5.88%", bdgScore: "4.20%", smgAch: "3.90%", smgScore: "2.79%" },
        { no: "2", parameter: "Retention Rate", definisi: "% Pelanggan fixed yang melakukan permintaan CAPS yang dapat dicegah sehingga tetap menggunakan layanan Fixed.", target: "40%", bobot: "5%", nasionalAch: "27.35%", nasionalAchTarget: "68.38%", nasionalScore: "3.42%", bdgAch: "30.17%", bdgScore: "3.77%", smgAch: "26.09%", smgScore: "3.26%" },
        { no: "3", parameter: "CAPS Number", definisi: "% Jumlah pelanggan yang melakukan CAPS di bulan ke-N dibandingkan dengan target RKAP.", target: "100%", bobot: "10%", nasionalAch: "125.52%", nasionalAchTarget: "79.67%", nasionalScore: "7.97%", bdgAch: "119.33%", bdgScore: "8.38%", smgAch: "128.31%", smgScore: "7.79%" },
        { no: "2", parameter: "Customer Experience", definisi: "", target: "", bobot: "45%", nasionalAch: "", nasionalAchTarget: "", nasionalScore: "51.14%", bdgAch: "", bdgScore: "51.95%", smgAch: "", smgScore: "50.88%", isCategoryRow: true },
        { no: "1", parameter: "tNPS Mobile (people)", definisi: "Hasil penilaian survey pelanggan Mobile", target: "95%", bobot: "10%", nasionalAch: "98%", nasionalAchTarget: "103.16%", nasionalScore: "10.32%", bdgAch: "98%", bdgScore: "10.32%", smgAch: "99%", smgScore: "10.42%" },
        { no: "2", parameter: "tNPS Fixed (people)", definisi: "Hasil penilaian survey pelanggan Fixed", target: "85%", bobot: "10%", nasionalAch: "75.00%", nasionalAchTarget: "88.24%", nasionalScore: "8.82%", bdgAch: "73.00%", bdgScore: "8.59%", smgAch: "75.00%", smgScore: "8.82%" },
        { no: "3", parameter: "Repeat Contact Rate (RCR) Mobile", definisi: "Repeated interaction per MSISDN per intention inside 3 days period", target: "6%", bobot: "5%", nasionalAch: "3.09%", nasionalAchTarget: "194.17%", nasionalScore: "9.71%", bdgAch: "3.09%", bdgScore: "9.71%", smgAch: "3.08%", smgScore: "9.74%" },
        { no: "4", parameter: "Repeat Contact Rate (RCR) Fixed", definisi: "Repeated interaction per IndiHome Number inside 7 days period", target: "20%", bobot: "5%", nasionalAch: "12.19%", nasionalAchTarget: "164.07%", nasionalScore: "8.20%", bdgAch: "11.01%", bdgScore: "9.08%", smgAch: "12.52%", smgScore: "7.99%" },
        { no: "5", parameter: "FCR Mobile", definisi: "Persentase interaksi Permintaan pelanggan Mobile selesai di agent", target: "99%", bobot: "4%", nasionalAch: "97.66%", nasionalAchTarget: "98.65%", nasionalScore: "3.95%", bdgAch: "97.91%", bdgScore: "3.96%", smgAch: "97.31%", smgScore: "3.93%" },
        { no: "", parameter: "FCR Mobile (Komplain)", definisi: "Persentase interaksi Komplain pelanggan Mobile selesai di agent", target: "66%", bobot: "4%", nasionalAch: "66.91%", nasionalAchTarget: "101.38%", nasionalScore: "4.06%", bdgAch: "68.90%", bdgScore: "4.18%", smgAch: "64.41%", smgScore: "3.90%", isSubRow: true },
        { no: "6", parameter: "FCR Fixed", definisi: "Persentase interaksi Komplain pelanggan Fixed selesai di agent", target: "45%", bobot: "3%", nasionalAch: "39.11%", nasionalAchTarget: "86.92%", nasionalScore: "2.61%", bdgAch: "39.21%", bdgScore: "2.61%", smgAch: "39.09%", smgScore: "2.61%" },
        { no: "", parameter: "FCR Fixed (Reciprocal)", definisi: "Persentase interaksi Komplain Reciprocal selesai di agent", target: "81%", bobot: "4%", nasionalAch: "70.41%", nasionalAchTarget: "86.93%", nasionalScore: "3.48%", bdgAch: "71.05%", bdgScore: "3.51%", smgAch: "70.22%", smgScore: "3.47%", isSubRow: true },
        { no: "3", parameter: "Internal Process", definisi: "", target: "", bobot: "35%", nasionalAch: "", nasionalAchTarget: "", nasionalScore: "34.28%", bdgAch: "", bdgScore: "33.94%", smgAch: "", smgScore: "34.48%", isCategoryRow: true },
        { no: "1", parameter: "Service Level", definisi: "Call yang di-pick up <15s dan Video Call <15s", target: "96%", bobot: "10%", nasionalAch: "91.82%", nasionalAchTarget: "95.65%", nasionalScore: "9.56%", bdgAch: "89.85%", bdgScore: "9.36%", smgAch: "92.52%", smgScore: "9.64%" },
        { no: "2", parameter: "Quality of Ticket", definisi: "In SLA Mobile : Persentase tiket Mobile close in SLA", target: "95%", bobot: "5%", nasionalAch: "93.59%", nasionalAchTarget: "98.52%", nasionalScore: "4.93%", bdgAch: "92.54%", bdgScore: "4.87%", smgAch: "94.76%", smgScore: "4.99%" },
        { no: "", parameter: "In SLA Fixed", definisi: "In SLA Fixed : Persentase tiket Fixed WSA close in SLA", target: "96.50%", bobot: "10%", nasionalAch: "94.40%", nasionalAchTarget: "97.82%", nasionalScore: "9.78%", bdgAch: "94.13%", bdgScore: "9.75%", smgAch: "94.53%", smgScore: "9.80%", isSubRow: true },
        { no: "", parameter: "Close rate tiket Mobile", definisi: "Close rate tiket Mobile close dibulan M-1", target: "98%", bobot: "10%", nasionalAch: "98.09%", nasionalAchTarget: "100.09%", nasionalScore: "10.01%", bdgAch: "97.60%", bdgScore: "9.96%", smgAch: "98.58%", smgScore: "10.06%", isSubRow: true },
        { no: "", parameter: "Total", definisi: "", target: "", bobot: "100%", nasionalAch: "", nasionalAchTarget: "", nasionalScore: "101.00%", bdgAch: "", bdgScore: "102.24%", smgAch: "", smgScore: "99.20%", isTotalRow: true },
      ],
    },
    {
      tabName: "e-Care",
      tabKey: "eCare",
      totalAchievement: 95,
      sections: [
        {
          name: "Revenue",
          weight: 10,
          target: 10,
          parameters: [
            { name: "Sales Ratio", target: "1%", dailyValues: { 1: "0.9%", 2: "1.1%", 15: "1.0%", 30: "1.0%" }, mtdAchievement: "1.0%", robotAchievement: "1.2%" },
          ],
        },
        {
          name: "Customer Experience",
          weight: 45,
          target: 45,
          parameters: [
            { name: "tNPS Mobile", target: "85%", dailyValues: { 1: "84.5%", 2: "85.2%", 15: "85.0%" }, mtdAchievement: "85.0%", robotAchievement: "86%" },
            { name: "tNPS Fixed", target: "85%", dailyValues: { 1: "85%", 2: "84.8%", 15: "85.1%" }, mtdAchievement: "85.1%", robotAchievement: "86%" },
            { name: "Repeat Mobile", target: "4%", dailyValues: { 1: "3.9%", 2: "4.1%", 15: "4.0%" }, mtdAchievement: "4.0%", robotAchievement: "4.2%" },
            { name: "Repeat Fixed", target: "17%", dailyValues: { 1: "16.8%", 2: "17.2%", 15: "17.0%" }, mtdAchievement: "17.0%", robotAchievement: "18%" },
            { name: "FCR Mobile Permintaan", target: "97%", dailyValues: { 1: "96.8%", 2: "97.1%", 15: "97.0%" }, mtdAchievement: "97.0%", robotAchievement: "97.5%" },
            { name: "FCR Mobile Komplain", target: "69%", dailyValues: { 1: "68.5%", 2: "69.2%", 15: "69.0%" }, mtdAchievement: "69.0%", robotAchievement: "70%" },
            { name: "FCR Fixed Komplain", target: "80%", dailyValues: { 1: "79.8%", 2: "80.2%", 15: "80.0%" }, mtdAchievement: "80.0%", robotAchievement: "81%" },
            { name: "FCR Fixed Reciprocal", target: "93%", dailyValues: { 1: "92.8%", 2: "93.1%", 15: "93.0%" }, mtdAchievement: "93.0%", robotAchievement: "94%" },
          ],
        },
        {
          name: "Internal Process",
          weight: 35,
          target: 35,
          parameters: [
            { name: "Response Time", target: "4'", dailyValues: { 1: "4.1'", 2: "3.9'", 15: "4.0'" }, mtdAchievement: "4.0'", robotAchievement: "3.8'" },
            { name: "Response Time Email", target: "15'", dailyValues: { 1: "14.8'", 2: "15.2'", 15: "15.0'" }, mtdAchievement: "15.0'", robotAchievement: "14.5'" },
            { name: "Ticket SLA Mobile", target: "93%", dailyValues: { 1: "92.8%", 2: "93.1%", 15: "93.0%" }, mtdAchievement: "93.0%", robotAchievement: "94%" },
            { name: "Ticket SLA Fixed", target: "96,5%", dailyValues: { 1: "96.5%", 2: "96.6%", 15: "96.5%" }, mtdAchievement: "96.5%", robotAchievement: "97%" },
            { name: "Close rate ticket Mobile", target: "98%", dailyValues: { 1: "97.8%", 2: "98.2%", 15: "98.0%" }, mtdAchievement: "98.0%", robotAchievement: "98.5%" },
          ],
        },
      ],
      summaryHighlight: [
        "Pencapaian e-Care menunjukkan peningkatan kepuasan pelanggan secara digital.",
        "Response Time rata-rata di angka 4 menit, sesuai target SLA.",
        "FCR Fixed Komplain sangat memuaskan di angka 80%.",
        "tNPS Mobile dan tNPS Fixed stabil di angka 85%.",
        "Response Time Email terjaga di rata-rata 15 menit.",
        "Ticket SLA Fixed mencapai hasil optimal 96.5%.",
        "Close rate ticket Mobile di angka 98%, menunjukkan penyelesaian isu yang efisien."
      ],
      monthlyComparison: [
        { no: "A", parameter: "Revenue", definisi: "", target: "", bobot: "10%", nasionalAch: "", nasionalAchTarget: "", nasionalScore: "10.00%", bdgAch: "", bdgScore: "10.90%", smgAch: "", smgScore: "9.10%", isCategoryRow: true },
        { no: "1", parameter: "Sales Interaction Ratio (SIR)", definisi: "Proporsi interaksi yang menghasilkan Sales dibandingkan seluruh interaksi oleh Agent", target: "1.00%", bobot: "10%", nasionalAch: "1.00%", nasionalAchTarget: "100.00%", nasionalScore: "10.00%", bdgAch: "1.09%", bdgScore: "10.90%", smgAch: "0.91%", smgScore: "9.10%" },
        { no: "B", parameter: "Customer Experience", definisi: "", target: "", bobot: "45%", nasionalAch: "", nasionalAchTarget: "", nasionalScore: "42.67%", bdgAch: "", bdgScore: "42.76%", smgAch: "", smgScore: "42.48%", isCategoryRow: true },
        { no: "1", parameter: "tNPS Mobile (people)", definisi: "Hasil penilaian survey pelanggan Mobile", target: "85%", bobot: "10%", nasionalAch: "87%", nasionalAchTarget: "102.35%", nasionalScore: "10.24%", bdgAch: "92%", bdgScore: "10.82%", smgAch: "80%", smgScore: "9.41%" },
        { no: "2", parameter: "tNPS Fixed (people)", definisi: "Hasil penilaian survey pelanggan Fixed", target: "85%", bobot: "10%", nasionalAch: "70.00%", nasionalAchTarget: "82.35%", nasionalScore: "8.24%", bdgAch: "68.00%", bdgScore: "8.00%", smgAch: "72.00%", smgScore: "8.47%" },
        { no: "3", parameter: "Repeat Contact Rate (RCR) Mobile", definisi: "Repeated interaction per MSISDN inside 3 days period", target: "4%", bobot: "5%", nasionalAch: "4.06%", nasionalAchTarget: "98.52%", nasionalScore: "4.93%", bdgAch: "4.14%", bdgScore: "4.83%", smgAch: "3.94%", smgScore: "5.08%" },
        { no: "4", parameter: "Repeat Contact Rate (RCR) Fixed", definisi: "Repeated interaction per IndiHome Number inside 7 days period", target: "17%", bobot: "5%", nasionalAch: "21.05%", nasionalAchTarget: "80.76%", nasionalScore: "4.04%", bdgAch: "21.76%", bdgScore: "3.91%", smgAch: "20.10%", smgScore: "4.23%" },
        { no: "5", parameter: "FCR Mobile", definisi: "Persentase interaksi Permintaan pelanggan Mobile selesai di agent", target: "97%", bobot: "4%", nasionalAch: "96.93%", nasionalAchTarget: "99.93%", nasionalScore: "4.00%", bdgAch: "97.59%", bdgScore: "4.02%", smgAch: "96.22%", smgScore: "3.97%" },
        { no: "", parameter: "FCR Mobile (Komplain)", definisi: "Persentase interaksi Komplain pelanggan Mobile selesai di agent", target: "69%", bobot: "4%", nasionalAch: "76.65%", nasionalAchTarget: "111.08%", nasionalScore: "4.44%", bdgAch: "76.34%", bdgScore: "4.43%", smgAch: "77.11%", smgScore: "4.47%", isSubRow: true },
        { no: "6", parameter: "FCR Fixed", definisi: "Persentase interaksi Komplain pelanggan Fixed selesai di agent", target: "80%", bobot: "3%", nasionalAch: "76.95%", nasionalAchTarget: "96.19%", nasionalScore: "2.89%", bdgAch: "76.63%", bdgScore: "2.87%", smgAch: "77.37%", smgScore: "2.90%" },
        { no: "", parameter: "FCR Fixed (Reciprocal)", definisi: "Persentase interaksi Komplain Reciprocal selesai di agent", target: "93%", bobot: "4%", nasionalAch: "90.89%", nasionalAchTarget: "97.74%", nasionalScore: "3.91%", bdgAch: "90.20%", bdgScore: "3.88%", smgAch: "91.88%", smgScore: "3.95%", isSubRow: true },
        { no: "C", parameter: "Internal Process", definisi: "", target: "", bobot: "45%", nasionalAch: "", nasionalAchTarget: "", nasionalScore: "40.88%", bdgAch: "", bdgScore: "41.15%", smgAch: "", smgScore: "40.41%", isCategoryRow: true },
        { no: "1", parameter: "respond time (socmed & chat/DM)", definisi: "Rata-rata respond time all bubble chat dalam menit", target: "4", bobot: "10%", nasionalAch: "5.35", nasionalAchTarget: "74.77%", nasionalScore: "7.48%", bdgAch: "5.34", bdgScore: "7.49%", smgAch: "5.5", smgScore: "7.27%" },
        { no: "2", parameter: "respond time email", definisi: "Rata-rata respond time email dalam menit", target: "15", bobot: "10%", nasionalAch: "17.43", nasionalAchTarget: "86.06%", nasionalScore: "8.61%", bdgAch: "16.85", bdgScore: "8.90%", smgAch: "18.12", smgScore: "8.28%" },
        { no: "3", parameter: "Quality of Ticket", definisi: "In SLA Mobile : Persentase tiket Mobile close in SLA", target: "93%", bobot: "5%", nasionalAch: "92.92%", nasionalAchTarget: "99.91%", nasionalScore: "5.00%", bdgAch: "92.86%", bdgScore: "4.99%", smgAch: "93.00%", smgScore: "5.00%" },
        { no: "", parameter: "In SLA Fixed", definisi: "In SLA Fixed : Persentase tiket Fixed WSA close in SLA", target: "96.50%", bobot: "10%", nasionalAch: "93.51%", nasionalAchTarget: "96.90%", nasionalScore: "9.69%", bdgAch: "93.17%", bdgScore: "9.65%", smgAch: "93.94%", smgScore: "9.73%", isSubRow: true },
        { no: "", parameter: "Close rate tiket Mobile", definisi: "Close rate tiket Mobile close dibulan M-1", target: "98%", bobot: "10%", nasionalAch: "99.12%", nasionalAchTarget: "101.14%", nasionalScore: "10.11%", bdgAch: "99.07%", bdgScore: "10.11%", smgAch: "99.23%", smgScore: "10.13%", isSubRow: true },
        { no: "", parameter: "Total", definisi: "", target: "", bobot: "100%", nasionalAch: "", nasionalAchTarget: "", nasionalScore: "93.55%", bdgAch: "", bdgScore: "94.81%", smgAch: "", smgScore: "91.99%", isTotalRow: true },
      ],
    },
  ],
};
