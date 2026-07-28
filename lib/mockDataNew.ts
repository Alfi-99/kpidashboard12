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
    },
  ],
};
