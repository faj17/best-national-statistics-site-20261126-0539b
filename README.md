# Nusantara in Numbers

Indonesia's national statistics, plainly presented: population, economy, health,
education and provinces — every figure with its source and year.

## What it is

A static site under `app/` (no build step, no network request): open
`app/index.html` in a browser, on a desktop or a phone. Eight sections, each
reached by a link in the top navigation:

- **Overview** — headline figures, population and GDP-growth charts, largest
  provinces, country facts.
- **Population** — a year slider (2019–2024) and the 2024 age structure.
- **Economy** — switchable chart (GDP growth / GDP per capita / inflation),
  employment by sector, 2024 trade.
- **Health** — life expectancy, infant mortality, stunting, maternal mortality.
- **Education** — literacy, years of schooling, enrolment.
- **Provinces** — searchable, sortable table of 12 provinces; tap a row for detail.
- **Data** — every indicator in one table, downloadable as CSV.
- **Sources** — where every number comes from and how it was rounded.

## Figures

All figures are official published statistics: BPS (Statistics Indonesia),
the Ministry of Health (SSGI 2024) and the World Bank (2023). Each indicator
on the site names its source and year; the Sources page lists them all.

## Run it

```sh
python3 -m http.server 8000 --directory app
# open http://localhost:8000/
```

Or hand it in: `node main.ts` copies `app/` and `screenshots/` to
`$MAKEFUN_OUTPUT_DIR` (default `/output`) and writes `dossier.json`.

## Structure

- `app/index.html` — the page and its eight sections
- `app/app.js` — routing, rendering, search/sort/download
- `app/data.js` — every figure, with source and year
- `app/charts.js` — hand-rolled SVG bar, line and donut charts
- `app/style.css` — the whole design, system fonts only
- `main.ts` — the hand-in program
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged
- `screenshots/` — real renders of the running site

## License

MIT. See `LICENSE`.
