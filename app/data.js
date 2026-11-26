// Nusantara in Numbers — the figures behind the site.
// Every figure is an official published statistic, each tagged with its
// source and year. Values are rounded for display; the notes in About say so.
// Sources: BPS (Statistics Indonesia), Ministry of Health (SSGI), World Bank.

export const COUNTRY = {
  name: "Indonesia",
  shortName: "Nusantara",
  capital: "Jakarta",
  updated: "26 November 2026",
};

export const HEADLINE = [
  { id: "pop", label: "Population", value: "281.6m", note: "mid-year estimate", source: "BPS, 2024", year: 2024 },
  { id: "gdp", label: "GDP", value: "Rp 22,139tn", note: "current prices, US$1.40tn", source: "BPS, 2024", year: 2024 },
  { id: "growth", label: "GDP growth", value: "5.03%", note: "year on year", source: "BPS, 2024", year: 2024 },
  { id: "poverty", label: "Poverty rate", value: "8.57%", note: "24.06 million people", source: "BPS, Sep 2024", year: 2024 },
  { id: "unemp", label: "Unemployment", value: "4.91%", note: "open unemployment rate", source: "BPS, Aug 2024", year: 2024 },
  { id: "infl", label: "Inflation", value: "1.57%", note: "year on year, December", source: "BPS, 2024", year: 2024 },
];

// Population, millions, mid-year estimates (BPS).
export const POP_BY_YEAR = [
  { year: 2019, value: 266.9 },
  { year: 2020, value: 270.2 },
  { year: 2021, value: 272.7 },
  { year: 2022, value: 275.8 },
  { year: 2023, value: 278.7 },
  { year: 2024, value: 281.6 },
];

// Age structure, 2024 (BPS): share of total population.
export const AGE_STRUCTURE = [
  { group: "0–14 years", share: 24.5 },
  { group: "15–64 years", share: 67.7 },
  { group: "65+ years", share: 7.8 },
];

// GDP growth, % year on year (BPS).
export const GDP_GROWTH = [
  { year: 2019, value: 5.02 },
  { year: 2020, value: -2.07 },
  { year: 2021, value: 3.70 },
  { year: 2022, value: 5.31 },
  { year: 2023, value: 5.05 },
  { year: 2024, value: 5.03 },
];

// GDP per capita, US$ (BPS).
export const GDP_PER_CAPITA = [
  { year: 2019, value: 4175 },
  { year: 2020, value: 3911 },
  { year: 2021, value: 4322 },
  { year: 2022, value: 4774 },
  { year: 2023, value: 4784 },
  { year: 2024, value: 4919 },
];

// Consumer price inflation, % year on year, December (BPS).
export const INFLATION = [
  { year: 2019, value: 2.72 },
  { year: 2020, value: 1.68 },
  { year: 2021, value: 1.87 },
  { year: 2022, value: 5.51 },
  { year: 2023, value: 2.61 },
  { year: 2024, value: 1.57 },
];

// Employment by sector, share of employed persons, August 2024 (BPS).
export const EMPLOYMENT_SECTORS = [
  { sector: "Services", share: 53.0, color: "#0e7c7b" },
  { sector: "Agriculture", share: 28.2, color: "#f2a541" },
  { sector: "Industry", share: 18.8, color: "#102a43" },
];

// Trade, US$ billion, 2024 (BPS).
export const TRADE = [
  { label: "Exports", value: 264.7, note: "US$ billion" },
  { label: "Imports", value: 233.7, note: "US$ billion" },
  { label: "Trade balance", value: 31.0, note: "US$ billion surplus" },
];

export const HEALTH = [
  { label: "Life expectancy", value: "74.15 years", source: "BPS, 2024", detail: "Life expectancy at birth, both sexes." },
  { label: "Infant mortality", value: "16.7 per 1,000", source: "BPS, 2024", detail: "Infant deaths per 1,000 live births." },
  { label: "Stunting in under-5s", value: "19.8%", source: "Ministry of Health (SSGI), 2024", detail: "Share of children under five stunted." },
  { label: "Maternal mortality", value: "173 per 100,000", source: "World Bank, 2023", detail: "Maternal deaths per 100,000 live births." },
];

export const EDUCATION = [
  { label: "Adult literacy", value: "96.0%", source: "BPS, 2024", detail: "Literacy rate, population aged 15 and over." },
  { label: "Mean years of schooling", value: "9.0 years", source: "BPS, 2024", detail: "Average years of schooling, population aged 25 and over." },
  { label: "Primary net enrolment", value: "97.9%", source: "BPS, 2023", detail: "Net enrolment rate, primary school." },
  { label: "Tertiary enrolment", value: "31.4%", source: "BPS, 2023", detail: "Gross enrolment rate, tertiary education." },
];

// Provinces: population (millions, BPS 2024 mid-year), area (km²), poverty rate % (BPS Sep 2024).
export const PROVINCES = [
  { name: "West Java", pop: 49.94, area: 35378, poverty: 7.46 },
  { name: "East Java", pop: 41.81, area: 47803, poverty: 10.35 },
  { name: "Central Java", pop: 37.89, area: 32801, poverty: 10.47 },
  { name: "North Sumatra", pop: 15.59, area: 72981, poverty: 8.72 },
  { name: "Banten", pop: 12.43, area: 9663, poverty: 5.71 },
  { name: "Jakarta", pop: 10.68, area: 664, poverty: 4.14 },
  { name: "South Sulawesi", pop: 9.36, area: 46717, poverty: 7.99 },
  { name: "Lampung", pop: 9.21, area: 34624, poverty: 10.69 },
  { name: "South Sumatra", pop: 8.96, area: 91592, poverty: 11.43 },
  { name: "Riau", pop: 7.01, area: 87024, poverty: 6.04 },
  { name: "West Sumatra", pop: 5.84, area: 42013, poverty: 5.76 },
  { name: "East Kalimantan", pop: 3.99, area: 127267, poverty: 6.11 },
];

export const COUNTRY_FACTS = [
  { label: "Islands", value: "17,508", body: "Islands in the archipelago, the largest in the world. Source: BPS." },
  { label: "Provinces", value: "38", body: "Provinces, from Aceh to South Papua, since the 2022 expansion. Source: BPS." },
  { label: "Regencies & cities", value: "514", body: "416 regencies and 98 cities. Source: BPS, 2024." },
  { label: "Official language", value: "Bahasa Indonesia", body: "Spoken alongside more than 700 local languages. Source: BPS." },
];

// Flat table for the Data page: every indicator, its value, year and source.
export const INDICATOR_TABLE = [
  ...HEADLINE.map((h) => ({ indicator: h.label, value: h.value, year: h.year, source: h.source })),
  { indicator: "Life expectancy", value: "74.15 years", year: 2024, source: "BPS" },
  { indicator: "Infant mortality", value: "16.7 per 1,000 live births", year: 2024, source: "BPS" },
  { indicator: "Stunting in under-5s", value: "19.8%", year: 2024, source: "Ministry of Health (SSGI)" },
  { indicator: "Maternal mortality", value: "173 per 100,000 live births", year: 2023, source: "World Bank" },
  { indicator: "Adult literacy (15+)", value: "96.0%", year: 2024, source: "BPS" },
  { indicator: "Mean years of schooling", value: "9.0 years", year: 2024, source: "BPS" },
  { indicator: "Primary net enrolment", value: "97.9%", year: 2023, source: "BPS" },
  { indicator: "Tertiary enrolment", value: "31.4%", year: 2023, source: "BPS" },
  { indicator: "Exports", value: "US$264.7 billion", year: 2024, source: "BPS" },
  { indicator: "Imports", value: "US$233.7 billion", year: 2024, source: "BPS" },
  { indicator: "Trade balance", value: "US$31.0 billion surplus", year: 2024, source: "BPS" },
];
