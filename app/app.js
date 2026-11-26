/* app.js — router, pages and controls.
 *
 * One job: turn the data in data.js into eight hash-routed pages and make
 * every control on them work. No figure lives here; every number comes
 * from data.js, so fixing a figure means editing one file, not eight.
 */

"use strict";

/* The eight sections, in nav order. `hash` is the part after `#/`. */
const PAGES = [
  { hash: "", label: "Overview" },
  { hash: "population", label: "Population" },
  { hash: "economy", label: "Economy" },
  { hash: "health", label: "Health" },
  { hash: "education", label: "Education" },
  { hash: "provinces", label: "Provinces" },
  { hash: "data", label: "Data" },
  { hash: "sources", label: "Sources" },
];

/* Escape user text before it goes into the page (search boxes echo it). */
function esc(raw) {
  return String(raw)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* One stat card: big figure, name, and the source + year under it. */
function statCard(ind) {
  return `<article class="card">
    <p class="card-value">${esc(ind.show)}</p>
    <h3 class="card-name">${esc(ind.name)}</h3>
    <p class="card-source">${esc(ind.source)} · ${esc(ind.year)}</p>
  </article>`;
}

/* Page heading: title, one line of introduction, nothing more. */
function pageHead(title, intro) {
  return `<header class="page-head"><h1>${esc(title)}</h1><p>${esc(intro)}</p></header>`;
}

/* A chart wrapped with its title and its source line. */
function chartBox(title, svg, source) {
  return `<section class="chart-box"><h2>${esc(title)}</h2>${svg}<p class="chart-source">Source: ${esc(source)}</p></section>`;
}

/* Download a CSV file in the browser: build a blob, click a temp link. */
function downloadCsv(filename, rows) {
  const body = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([body], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/* ---- Overview: the four headline figures, growth, and the GDP mix. ---- */
function viewOverview() {
  const pick = ["population", "gdp", "growth", "poverty"].map(findIndicator);
  const quick = ["unemployment", "inflation", "life-expectancy", "stunting"].map(findIndicator);
  let facts = `<ul class="fact-list">`;
  for (const ind of quick) {
    facts += `<li><strong>${esc(ind.show)}</strong> — ${esc(ind.name)} <span class="muted">(${esc(ind.source)}, ${esc(ind.year)})</span></li>`;
  }
  facts += "</ul>";
  return pageHead("Indonesia in numbers", "The country at a glance: 285.7 million people, the world's fourth-largest population, and Southeast Asia's largest economy. Every figure below names its source and year.") +
    `<div class="card-grid">${pick.map(statCard).join("")}</div>` +
    `<div class="split">` +
    chartBox("Economic growth bounced back after 2020", lineChart(SERIES.growth), SERIES.growth.source + " · 2020–2024") +
    chartBox("Where GDP comes from", donutChart(SECTORS), "BPS — Statistics Indonesia, 2024") +
    `</div>` +
    `<section class="panel"><h2>Also in brief</h2>${facts}</section>`;
}

/* ---- Population: a year slider over 2020–2024 plus the big provinces. ---- */
function viewPopulation() {
  const series = SERIES.population;
  const last = series.points[series.points.length - 1];
  const topFive = PROVINCES.slice(0, 5).map((p) => [p.name, p.pop]);
  return pageHead("Population", "Indonesia's population, how it has grown since 2020, and where its people live — the 12 most populous of 38 provinces.") +
    `<section class="panel"><h2>Population by year</h2>
      <p class="big-figure"><span id="pop-year-value">${last[1]} million</span> <span class="muted">in <span id="pop-year-label">${last[0]}</span></span></p>
      <label class="slider-row">Year
        <input id="pop-year-slider" type="range" min="2020" max="2024" step="1" value="2024" aria-label="Population year">
        <span id="pop-year-echo">2024</span>
      </label>
      <p class="muted">Drag the slider: the figure above follows the year. ${esc(series.source)}.</p>
    </section>` +
    `<div class="split">` +
    chartBox("Population, 2020–2024", lineChart(series), series.source) +
    chartBox("Largest provinces, millions of people", barChart({ label: "Largest provinces", points: topFive }), "BPS — Statistics Indonesia, mid-year 2024") +
    `</div>`;
}

function bindPopulation() {
  const slider = document.getElementById("pop-year-slider");
  if (!slider) return;
  slider.addEventListener("input", () => {
    const year = Number(slider.value);
    const point = SERIES.population.points.find((p) => p[0] === year);
    document.getElementById("pop-year-value").textContent = point[1] + " million";
    document.getElementById("pop-year-label").textContent = String(year);
    document.getElementById("pop-year-echo").textContent = String(year);
  });
}

/* ---- Economy: growth/inflation switcher, trade, and the poverty fall. ---- */
function viewEconomy() {
  const trade = ["exports", "imports", "trade-balance"].map(findIndicator);
  return pageHead("Economy", "Growth, prices, trade and poverty — the economy in four pictures, all from BPS unless stated.") +
    `<section class="panel"><h2>Growth or inflation, year by year</h2>
      <div class="toggle" role="group" aria-label="Choose the series">
        <button id="metric-growth" class="toggle-btn active" type="button">Economic growth</button>
        <button id="metric-inflation" class="toggle-btn" type="button">Inflation</button>
      </div>
      <div id="metric-chart">${barChart(SERIES.growth, { height: 240 })}</div>
      <p class="chart-source">Source: <span id="metric-source">${esc(SERIES.growth.source)}</span> · 2020–2024</p>
    </section>` +
    `<div class="card-grid">${trade.map(statCard).join("")}</div>` +
    chartBox("Poverty keeps falling", lineChart(SERIES.poverty), SERIES.poverty.source);
}

function bindEconomy() {
  const growthBtn = document.getElementById("metric-growth");
  const inflationBtn = document.getElementById("metric-inflation");
  if (!growthBtn || !inflationBtn) return;
  const show = (key, activeBtn, idleBtn) => {
    document.getElementById("metric-chart").innerHTML = barChart(SERIES[key], { height: 240 });
    document.getElementById("metric-source").textContent = SERIES[key].source;
    activeBtn.classList.add("active");
    idleBtn.classList.remove("active");
  };
  growthBtn.addEventListener("click", () => show("growth", growthBtn, inflationBtn));
  inflationBtn.addEventListener("click", () => show("inflation", inflationBtn, growthBtn));
}

/* ---- Health: how long people live, and stunting in young children. ---- */
function viewHealth() {
  const cards = ["life-expectancy", "stunting"].map(findIndicator);
  return pageHead("Health", "Two numbers that sum up health in Indonesia: a life expectancy of 71.3 years, and stunting still affecting about one child in five under five.") +
    `<div class="card-grid">${cards.map(statCard).join("")}</div>` +
    chartBox("Stunting is falling, slowly", barChart(SERIES.stunting, { color: "#b45309" }), SERIES.stunting.source + " · 2022–2024") +
    `<section class="panel"><h2>What to read into it</h2>
      <p>Stunting fell from 21.6% in 2022 to 19.8% in 2024, but the government's own target is 14% — the gap is the story. Life expectancy, at 71.3 years, sits below the East Asia and Pacific average, which is why the health pages of BPS and the Ministry of Health track both figures every year.</p>
    </section>`;
}

/* ---- Education: literacy, schooling, and the schooling ladder. ---- */
function viewEducation() {
  const cards = ["literacy", "schooling", "hdi"].map(findIndicator);
  return pageHead("Education", "Nearly everyone can read, but the average Indonesian leaves school after about nine years — four years short of what the system expects.") +
    `<div class="card-grid">${cards.map(statCard).join("")}</div>` +
    chartBox("Mean vs expected years of schooling", compareBars(SCHOOLING.mean, SCHOOLING.expected), SCHOOLING.source) +
    `<section class="panel"><h2>What to read into it</h2>
      <p>Literacy for people aged 15 and over reached 96.1% in 2024, yet mean schooling is only 9.1 years — the typical adult finished junior high. Expected schooling, 13.6 years, is what a child starting school today can expect if today's enrolment holds: the four-year gap is the dropout the system still has to close.</p>
    </section>`;
}

/* ---- Provinces: searchable, sortable table with a row-detail panel. ---- */
let provinceQuery = "";
let provinceSort = "pop-desc";
let provinceSelected = null;

function provinceRows() {
  const q = provinceQuery.trim().toLowerCase();
  let rows = PROVINCES.filter((p) => !q || p.name.toLowerCase().includes(q) || p.capital.toLowerCase().includes(q));
  if (provinceSort === "pop-asc") rows = rows.slice().sort((a, b) => a.pop - b.pop);
  else if (provinceSort === "name") rows = rows.slice().sort((a, b) => a.name.localeCompare(b.name));
  else rows = rows.slice().sort((a, b) => b.pop - a.pop);
  return rows;
}

function viewProvinces() {
  return pageHead("Provinces", "The 12 most populous provinces hold most of Indonesia. Search by province or capital, sort the table, click a row for its detail — or download the whole table as CSV.") +
    `<section class="panel"><div class="controls">
      <label>Search <input id="prov-search" type="search" placeholder="Province or capital" value="${esc(provinceQuery)}" aria-label="Search provinces"></label>
      <label>Sort by
        <select id="prov-sort" aria-label="Sort provinces">
          <option value="pop-desc"${provinceSort === "pop-desc" ? " selected" : ""}>Largest first</option>
          <option value="pop-asc"${provinceSort === "pop-asc" ? " selected" : ""}>Smallest first</option>
          <option value="name"${provinceSort === "name" ? " selected" : ""}>Name A–Z</option>
        </select>
      </label>
      <button id="prov-csv" class="btn" type="button">Download CSV</button>
    </div>
    <div id="prov-detail">${provinceSelected ? provinceDetail(provinceSelected) : `<p class="muted">Click a province row to see its detail.</p>`}</div>
    <table class="data-table"><thead><tr><th>Province</th><th>Capital</th><th>Population (millions)</th><th>Share of Indonesia</th></tr></thead>
    <tbody id="prov-body">${provinceRows().map(provinceRow).join("")}</tbody></table>
    <p class="chart-source">Source: BPS — Statistics Indonesia, mid-year 2024 estimates. Shares are of the 2024 population of 281.6 million.</p></section>`;
}

function provinceRow(p) {
  const share = ((p.pop / 281.6) * 100).toFixed(1);
  return `<tr data-province="${esc(p.name)}" tabindex="0"><td>${esc(p.name)}</td><td>${esc(p.capital)}</td><td>${p.pop.toFixed(1)}</td><td>${share}%</td></tr>`;
}

function provinceDetail(p) {
  const share = ((p.pop / 281.6) * 100).toFixed(1);
  return `<p><strong>${esc(p.name)}</strong> — capital ${esc(p.capital)} — has ${p.pop.toFixed(1)} million people, ${share}% of Indonesia. That is roughly one person in ${Math.max(1, Math.round(100 / Number(share)))} nationwide.</p>`;
}

function bindProvinces() {
  const search = document.getElementById("prov-search");
  const sort = document.getElementById("prov-sort");
  const csvBtn = document.getElementById("prov-csv");
  if (!search || !sort || !csvBtn) return;
  const refresh = () => {
    document.getElementById("prov-body").innerHTML = provinceRows().map(provinceRow).join("");
    bindProvinceRows();
  };
  search.addEventListener("input", () => { provinceQuery = search.value; refresh(); });
  sort.addEventListener("change", () => { provinceSort = sort.value; refresh(); });
  csvBtn.addEventListener("click", () => {
    downloadCsv("indonesia-provinces-2024.csv", [
      ["Province", "Capital", "Population (millions)", "Source"],
      ...PROVINCES.map((p) => [p.name, p.capital, p.pop, "BPS 2024"]),
    ]);
  });
  bindProvinceRows();
}

function bindProvinceRows() {
  document.querySelectorAll("#prov-body tr").forEach((row) => {
    const open = () => {
      const found = PROVINCES.find((p) => p.name === row.dataset.province);
      if (!found) return;
      provinceSelected = found;
      document.getElementById("prov-detail").innerHTML = provinceDetail(found);
    };
    row.addEventListener("click", open);
    row.addEventListener("keydown", (e) => { if (e.key === "Enter") open(); });
  });
}

/* ---- Data: every indicator in one searchable table, with CSV download. ---- */
let dataQuery = "";

function viewData() {
  const q = dataQuery.trim().toLowerCase();
  const rows = INDICATORS.filter((ind) => !q || ind.name.toLowerCase().includes(q) || ind.group.toLowerCase().includes(q) || ind.source.toLowerCase().includes(q));
  return pageHead("Data", "All 18 indicators in one table. Search by name, group or source, and download the table as CSV.") +
    `<section class="panel"><div class="controls">
      <label>Search indicators <input id="data-search" type="search" placeholder="Try “poverty” or “BPS”" value="${esc(dataQuery)}" aria-label="Search indicators"></label>
      <button id="data-csv" class="btn" type="button">Download CSV</button>
    </div>
    <table class="data-table"><thead><tr><th>Indicator</th><th>Value</th><th>Group</th><th>Source</th><th>Year</th></tr></thead>
    <tbody>${rows.map((ind) => `<tr><td>${esc(ind.name)}</td><td><strong>${esc(ind.show)}</strong></td><td>${esc(ind.group)}</td><td>${esc(ind.source)}</td><td>${esc(ind.year)}</td></tr>`).join("") || `<tr><td colspan="5">No indicator matches “${esc(dataQuery)}”.</td></tr>`}</tbody></table>
    <p class="chart-source">${INDICATORS.length} indicators · ${rows.length} shown · ${esc(SITE.note)}</p></section>`;
}

function bindData() {
  const search = document.getElementById("data-search");
  const csvBtn = document.getElementById("data-csv");
  if (!search || !csvBtn) return;
  search.addEventListener("input", () => { dataQuery = search.value; render(); });
  csvBtn.addEventListener("click", () => {
    downloadCsv("indonesia-indicators.csv", [
      ["Indicator", "Value", "Unit", "Group", "Source", "Year"],
      ...INDICATORS.map((ind) => [ind.name, ind.value, ind.unit, ind.group, ind.source, ind.year]),
    ]);
  });
}

/* ---- Sources: where every number comes from, and the fine print. ---- */
function viewSources() {
  let list = `<ul class="source-list">`;
  for (const s of SOURCES) {
    list += `<li><strong>${esc(s.name)}</strong> — ${esc(s.what)}<br><span class="muted">${esc(s.link)}</span></li>`;
  }
  list += "</ul>";
  return pageHead("Sources", "Nothing on this site is invented. Each figure names its publisher and year where it appears; the publishers are listed here.") +
    `<section class="panel"><h2>Publishers</h2>${list}</section>` +
    `<section class="panel"><h2>Notes on the numbers</h2>
      <p>Population for 2025 is the United Nations' medium estimate; the 2020–2024 series is BPS mid-year estimates, which is why the two differ slightly. Poverty is measured by BPS twice a year; the figure shown is September 2024. Unemployment is the August 2025 Sakernas round. The Gini ratio is March 2024. Province populations are rounded to one decimal; shares are computed from the unrounded 2024 total of 281.6 million. Trade figures are goods only, in US dollars, for the calendar year 2024.</p>
      <p class="muted">Page last updated ${esc(SITE.updated)}. This is an independent presentation of public statistics; it is not affiliated with BPS, the World Bank, the United Nations, the Ministry of Health or APJII.</p>
    </section>`;
}

/* ---- Router: hash to view, nav highlight, then bind the page's controls. ---- */
const VIEWS = {
  "": { render: viewOverview, bind: null },
  "population": { render: viewPopulation, bind: bindPopulation },
  "economy": { render: viewEconomy, bind: bindEconomy },
  "health": { render: viewHealth, bind: null },
  "education": { render: viewEducation, bind: null },
  "provinces": { render: viewProvinces, bind: bindProvinces },
  "data": { render: viewData, bind: bindData },
  "sources": { render: viewSources, bind: null },
};

function currentHash() {
  const raw = window.location.hash.replace(/^#\/?/, "");
  return Object.prototype.hasOwnProperty.call(VIEWS, raw) ? raw : "";
}

function render() {
  const hash = currentHash();
  const view = VIEWS[hash];
  document.getElementById("page").innerHTML = view.render();
  document.querySelectorAll(".site-nav a").forEach((link) => {
    link.classList.toggle("active", link.dataset.page === hash);
  });
  document.title = "Nusantara in Numbers — " + (PAGES.find((p) => p.hash === hash) || PAGES[0]).label;
  if (view.bind) view.bind();
  window.scrollTo(0, 0);
}

function buildNav() {
  document.getElementById("site-nav").innerHTML = PAGES.map((p) =>
    `<a href="#/${p.hash}" data-page="${p.hash}">${esc(p.label)}</a>`).join("");
}

buildNav();
window.addEventListener("hashchange", render);
render();
