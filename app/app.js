// Nusantara in Numbers — page logic: routing, charts, tables, downloads.
// One module, one job: wire the static page in index.html to the data in data.js.

import {
  HEADLINE, POP_BY_YEAR, AGE_STRUCTURE, GDP_GROWTH, GDP_PER_CAPITA,
  INFLATION, EMPLOYMENT_SECTORS, TRADE, HEALTH, EDUCATION, PROVINCES,
  COUNTRY_FACTS, INDICATOR_TABLE,
} from "./data.js";
import { barChart, lineChart, donutChart } from "./charts.js";

const $ = (id) => document.getElementById(id);
const ROUTES = ["overview", "population", "economy", "health", "education", "regions", "data", "about"];

function show(route) {
  const name = ROUTES.includes(route) ? route : "overview";
  for (const r of ROUTES) {
    const sec = $("page-" + r);
    if (sec) sec.hidden = r !== name;
  }
  for (const link of document.querySelectorAll(".nav-link")) {
    const on = link.dataset.route === name;
    link.classList.toggle("active", on);
    if (on) link.setAttribute("aria-current", "page"); else link.removeAttribute("aria-current");
  }
  const titles = {
    overview: "Indonesia at a glance",
    population: "Population",
    economy: "Economy",
    health: "Health",
    education: "Education",
    regions: "Provinces",
    data: "All indicators",
    about: "Sources & methods",
  };
  $("page-title").textContent = titles[name];
  window.scrollTo(0, 0);
}

function statCard(h) {
  return `<article class="stat"><p class="stat-value">${h.value}</p>
    <p class="stat-label">${h.label}</p>
    <p class="stat-note">${h.note} · ${h.source}</p></article>`;
}

function renderOverview() {
  $("headline-stats").innerHTML = HEADLINE.map(statCard).join("");
  barChart($("chart-pop-overview"), POP_BY_YEAR.map((d) => ({ label: String(d.year), value: d.value })), { label: "Population by year, millions", decimals: 1 });
  lineChart($("chart-gdp-overview"), GDP_GROWTH.map((d) => ({ label: String(d.year), value: d.value })), { label: "GDP growth, percent", unit: "%", decimals: 2 });
  const top5 = [...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 5);
  $("top-provinces").innerHTML = top5.map((p) => `<li><span>${p.name}</span><strong>${p.pop.toFixed(2)}m</strong></li>`).join("");
  $("releases").innerHTML = COUNTRY_FACTS.map((r) => `<li><time>${r.label}</time><strong>${r.value}</strong><p>${r.body}</p></li>`).join("");
}

let popYear = 2024;
function renderPopulation() {
  const row = POP_BY_YEAR.find((d) => d.year === popYear);
  $("pop-year-value").textContent = row.value.toFixed(1) + " million";
  $("pop-year-note").textContent = "Mid-year estimate, BPS " + popYear + ". Up from " +
    (POP_BY_YEAR.find((d) => d.year === popYear - 1) || { value: row.value }).value.toFixed(1) + " million in " + (popYear - 1) + ".";
  barChart($("chart-population"), POP_BY_YEAR.map((d) => ({ label: String(d.year), value: d.value })), { label: "Population by year, millions", decimals: 1 });
  barChart($("chart-age"), AGE_STRUCTURE.map((d) => ({ label: d.group, value: d.share })), { label: "Age structure 2024, percent of population", color: "#f2a541", decimals: 1 });
}

let econMetric = "growth";
const ECON_SERIES = {
  growth: { data: GDP_GROWTH, label: "GDP growth, percent year on year", unit: "%", decimals: 2, color: "#0e7c7b", note: "Real GDP growth, year on year. Source: BPS." },
  capita: { data: GDP_PER_CAPITA, label: "GDP per capita, US dollars", unit: "", decimals: 0, color: "#102a43", note: "GDP per capita in current US dollars. Source: BPS." },
  inflation: { data: INFLATION, label: "Consumer price inflation, percent", unit: "%", decimals: 2, color: "#b3402e", note: "Consumer price inflation, year on year, December. Source: BPS." },
};
function renderEconomy() {
  const s = ECON_SERIES[econMetric];
  lineChart($("chart-economy"), s.data.map((d) => ({ label: String(d.year), value: d.value })), { label: s.label, unit: s.unit, decimals: s.decimals, color: s.color });
  $("econ-note").textContent = s.note;
  donutChart($("chart-sectors"), EMPLOYMENT_SECTORS.map((d) => ({ label: d.sector, value: d.share, color: d.color })), { label: "Employment by sector, percent", centreLabel: "of employed" });
  $("sector-legend").innerHTML = EMPLOYMENT_SECTORS.map((d) =>
    `<li><span class="swatch" style="background:${d.color}"></span>${d.sector}<strong>${d.share.toFixed(1)}%</strong></li>`).join("");
  $("trade-cards").innerHTML = TRADE.map((t) => `<article class="stat"><p class="stat-value">US$${t.value.toFixed(1)}bn</p><p class="stat-label">${t.label}</p><p class="stat-note">${t.note} · BPS, 2024</p></article>`).join("");
}

function indicatorCards(list, hostId) {
  $(hostId).innerHTML = list.map((h) => `<article class="stat"><p class="stat-value">${h.value}</p>
    <p class="stat-label">${h.label}</p><p class="stat-note">${h.detail}</p><p class="stat-source">${h.source}</p></article>`).join("");
}

let regionQuery = "", regionSort = "pop", regionDesc = true;
function density(p) { return p.pop * 1e6 / p.area; }
function renderRegions() {
  let rows = PROVINCES.filter((p) => p.name.toLowerCase().includes(regionQuery.toLowerCase()));
  const key = { pop: (p) => p.pop, name: (p) => p.name, density, poverty: (p) => p.poverty }[regionSort];
  rows.sort((a, b) => {
    const va = key(a), vb = key(b);
    return regionDesc ? (vb > va ? 1 : vb < va ? -1 : 0) : (va > vb ? 1 : va < vb ? -1 : 0);
  });
  const body = $("regions-body");
  body.innerHTML = rows.map((p) => `<tr data-name="${p.name}" tabindex="0">
    <td>${p.name}</td><td>${p.pop.toFixed(2)}</td><td>${p.area.toLocaleString("en-US")}</td>
    <td>${Math.round(density(p)).toLocaleString("en-US")}</td><td>${p.poverty.toFixed(2)}%</td></tr>`).join("") ||
    `<tr><td colspan="5">No province matches “${regionQuery}”. Clear the search to see all twelve.</td></tr>`;
  $("regions-count").textContent = rows.length + " of 12 provinces shown · BPS, 2024";
  for (const tr of body.querySelectorAll("tr[data-name]")) {
    const pick = () => showProvince(tr.dataset.name);
    tr.addEventListener("click", pick);
    tr.addEventListener("keydown", (e) => { if (e.key === "Enter") pick(); });
  }
  for (const th of document.querySelectorAll("#regions-table th[data-sort]")) {
    th.setAttribute("aria-sort", th.dataset.sort === regionSort ? (regionDesc ? "descending" : "ascending") : "none");
  }
}

function showProvince(name) {
  const p = PROVINCES.find((x) => x.name === name);
  if (!p) return;
  $("province-detail").hidden = false;
  $("province-detail").innerHTML = `<h3>${p.name}</h3>
    <p><strong>${p.pop.toFixed(2)} million</strong> people on <strong>${p.area.toLocaleString("en-US")} km²</strong> —
    about <strong>${Math.round(density(p)).toLocaleString("en-US")} people per km²</strong>.</p>
    <p>Poverty rate <strong>${p.poverty.toFixed(2)}%</strong> (BPS, September 2024). Population: BPS 2024 mid-year estimate.</p>
    <button type="button" id="province-close">Close</button>`;
  $("province-close").addEventListener("click", () => { $("province-detail").hidden = true; });
}

function renderData() {
  $("data-body").innerHTML = INDICATOR_TABLE.map((r) =>
    `<tr><td>${r.indicator}</td><td>${r.value}</td><td>${r.year}</td><td>${r.source}</td></tr>`).join("");
}

function downloadCsv() {
  const head = "Indicator,Value,Year,Source\n";
  const lines = INDICATOR_TABLE.map((r) => `"${r.indicator}","${r.value}",${r.year},"${r.source}"`).join("\n");
  const blob = new Blob([head + lines + "\n"], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "indonesia-indicators-2024.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  $("csv-note").textContent = "Downloaded indonesia-indicators-2024.csv — " + INDICATOR_TABLE.length + " indicators.";
}

function init() {
  renderOverview();
  renderPopulation();
  renderEconomy();
  indicatorCards(HEALTH, "health-cards");
  indicatorCards(EDUCATION, "education-cards");
  renderRegions();
  renderData();

  window.addEventListener("hashchange", () => show(location.hash.replace(/^#\/?/, "") || "overview"));
  show(location.hash.replace(/^#\/?/, "") || "overview");

  $("pop-year").addEventListener("input", (e) => { popYear = Number(e.target.value); $("pop-year-label").textContent = popYear; renderPopulation(); });
  for (const btn of document.querySelectorAll("[data-metric]")) {
    btn.addEventListener("click", () => {
      econMetric = btn.dataset.metric;
      for (const b of document.querySelectorAll("[data-metric]")) b.classList.toggle("active", b === btn);
      renderEconomy();
    });
  }
  $("region-search").addEventListener("input", (e) => { regionQuery = e.target.value; renderRegions(); });
  for (const th of document.querySelectorAll("#regions-table th[data-sort]")) {
    th.addEventListener("click", () => {
      if (regionSort === th.dataset.sort) regionDesc = !regionDesc;
      else { regionSort = th.dataset.sort; regionDesc = true; }
      renderRegions();
    });
  }
  $("download-csv").addEventListener("click", downloadCsv);
}

init();
