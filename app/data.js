/* data.js — every figure on this site.
 *
 * One job: hold the numbers, their sources and their years, so the views
 * in app.js never carry a figure of their own. All values are published
 * statistics for Indonesia; each indicator names its source and year on
 * the page that shows it. Nothing here is estimated by this site.
 */

"use strict";

/* The country this site is about, and the vintage of the data. */
const SITE = {
  country: "Indonesia",
  tagline: "Indonesia in numbers — plain, sourced, up to date",
  updated: "26 November 2026",
  note: "Figures are the latest published value for each indicator.",
};

/* 18 headline indicators. `show` is the text printed on the card;
 * `value` is the numeric form the charts and the CSV download use. */
const INDICATORS = [
  { id: "population", name: "Population", show: "285.7 million", value: 285.7, unit: "million people", group: "People", source: "UN World Population Prospects 2024", year: "2025" },
  { id: "gdp", name: "Gross domestic product", show: "US$1.40 trillion", value: 1.4, unit: "US$ trillion", group: "Economy", source: "World Bank", year: "2024" },
  { id: "gdp-per-person", name: "GDP per person", show: "US$4,925", value: 4925, unit: "US$ per person", group: "Economy", source: "World Bank", year: "2024" },
  { id: "growth", name: "Economic growth", show: "5.03%", value: 5.03, unit: "% per year", group: "Economy", source: "BPS — Statistics Indonesia", year: "2024" },
  { id: "inflation", name: "Inflation", show: "1.57%", value: 1.57, unit: "% per year", group: "Economy", source: "BPS — Statistics Indonesia", year: "2024" },
  { id: "unemployment", name: "Unemployment rate", show: "4.85%", value: 4.85, unit: "% of the labour force", group: "Jobs", source: "BPS Sakernas (Labour Force Survey)", year: "Aug 2025" },
  { id: "poverty", name: "Poverty rate", show: "8.57%", value: 8.57, unit: "% of the population", group: "People", source: "BPS — Statistics Indonesia", year: "Sep 2024" },
  { id: "life-expectancy", name: "Life expectancy at birth", show: "71.3 years", value: 71.3, unit: "years", group: "Health", source: "World Bank", year: "2024" },
  { id: "hdi", name: "Human Development Index", show: "75.02", value: 75.02, unit: "index, 0–100", group: "People", source: "BPS — Statistics Indonesia", year: "2024" },
  { id: "stunting", name: "Stunting in children under five", show: "19.8%", value: 19.8, unit: "% of children under five", group: "Health", source: "Ministry of Health, SSGI survey", year: "2024" },
  { id: "literacy", name: "Literacy rate, age 15 and over", show: "96.1%", value: 96.1, unit: "% of people 15+", group: "Education", source: "BPS — Statistics Indonesia", year: "2024" },
  { id: "schooling", name: "Mean years of schooling", show: "9.1 years", value: 9.1, unit: "years", group: "Education", source: "BPS — Statistics Indonesia", year: "2024" },
  { id: "gini", name: "Gini ratio", show: "0.379", value: 0.379, unit: "ratio, 0–1", group: "People", source: "BPS — Statistics Indonesia", year: "Mar 2024" },
  { id: "exports", name: "Exports of goods", show: "US$264.7 billion", value: 264.7, unit: "US$ billion", group: "Trade", source: "BPS — Statistics Indonesia", year: "2024" },
  { id: "imports", name: "Imports of goods", show: "US$233.7 billion", value: 233.7, unit: "US$ billion", group: "Trade", source: "BPS — Statistics Indonesia", year: "2024" },
  { id: "trade-balance", name: "Trade balance", show: "US$31.0 billion surplus", value: 31.0, unit: "US$ billion", group: "Trade", source: "BPS — Statistics Indonesia", year: "2024" },
  { id: "internet", name: "Internet users", show: "79.5%", value: 79.5, unit: "% of the population", group: "People", source: "APJII Internet Survey", year: "2024" },
  { id: "density", name: "Population density", show: "149 per km²", value: 149, unit: "people per km²", group: "People", source: "BPS — Statistics Indonesia", year: "2024" },
];

/* Five-year series, 2020–2024, for the charts. Each point is [year, value]. */
const SERIES = {
  growth: {
    label: "Economic growth, % per year",
    source: "BPS — Statistics Indonesia",
    points: [[2020, -2.07], [2021, 3.7], [2022, 5.31], [2023, 5.05], [2024, 5.03]],
  },
  inflation: {
    label: "Inflation, % per year",
    source: "BPS — Statistics Indonesia",
    points: [[2020, 1.68], [2021, 1.87], [2022, 5.51], [2023, 2.61], [2024, 1.57]],
  },
  poverty: {
    label: "Poverty rate, % of population",
    source: "BPS — Statistics Indonesia, September each year",
    points: [[2020, 10.19], [2021, 9.71], [2022, 9.57], [2023, 9.36], [2024, 8.57]],
  },
  population: {
    label: "Population, millions",
    source: "BPS — Statistics Indonesia, mid-year estimates",
    points: [[2020, 270.2], [2021, 272.5], [2022, 275.8], [2023, 278.7], [2024, 281.6]],
  },
  stunting: {
    label: "Stunting in children under five, %",
    source: "Ministry of Health, SSGI survey",
    points: [[2022, 21.6], [2023, 21.5], [2024, 19.8]],
  },
};

/* The 12 most populous provinces, millions of people, BPS mid-year 2024. */
const PROVINCES = [
  { name: "West Java", pop: 50.3, capital: "Bandung" },
  { name: "East Java", pop: 41.8, capital: "Surabaya" },
  { name: "Central Java", pop: 37.9, capital: "Semarang" },
  { name: "North Sumatra", pop: 15.6, capital: "Medan" },
  { name: "Banten", pop: 12.4, capital: "Serang" },
  { name: "Jakarta", pop: 10.7, capital: "Jakarta" },
  { name: "South Sulawesi", pop: 9.4, capital: "Makassar" },
  { name: "Lampung", pop: 9.3, capital: "Bandar Lampung" },
  { name: "South Sumatra", pop: 8.9, capital: "Palembang" },
  { name: "Riau", pop: 6.6, capital: "Pekanbaru" },
  { name: "West Kalimantan", pop: 5.8, capital: "Pontianak" },
  { name: "West Sumatra", pop: 5.8, capital: "Padang" },
];

/* Shares of GDP by sector, %, BPS 2024. "All other sectors" is the remainder. */
const SECTORS = [
  { name: "Manufacturing", share: 18.7 },
  { name: "Wholesale and retail trade", share: 12.9 },
  { name: "Agriculture, forestry and fishing", share: 12.5 },
  { name: "Construction", share: 9.8 },
  { name: "Mining and quarrying", share: 8.4 },
  { name: "All other sectors", share: 37.7 },
];

/* Schooling, years, BPS 2024 — the comparison bars on the Education page. */
const SCHOOLING = {
  mean: { label: "Mean years of schooling", value: 9.1 },
  expected: { label: "Expected years of schooling", value: 13.6 },
  source: "BPS — Statistics Indonesia, 2024",
};

/* Where every number comes from, for the Sources page. */
const SOURCES = [
  { name: "BPS — Statistics Indonesia", what: "Population, growth, inflation, poverty, unemployment (Sakernas), HDI, schooling, literacy, Gini, trade, provinces", link: "https://www.bps.go.id" },
  { name: "World Bank Open Data", what: "GDP, GDP per person, life expectancy", link: "https://data.worldbank.org/country/indonesia" },
  { name: "UN World Population Prospects 2024", what: "Population, 2025 estimate", link: "https://population.un.org/wpp" },
  { name: "Ministry of Health — SSGI 2024", what: "Stunting in children under five", link: "https://www.kemkes.go.id" },
  { name: "APJII Internet Survey 2024", what: "Share of the population using the internet", link: "https://apjii.or.id" },
];

/* Look an indicator up by id; returns undefined when there is none. */
function findIndicator(id) {
  for (const item of INDICATORS) {
    if (item.id === id) return item;
  }
  return undefined;
}
