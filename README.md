# best-national-statistics-site-20261126-0539b

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/faj17/best-national-statistics-site-20261126-0539b/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/faj17/best-national-statistics-site-20261126-0539b/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

Nusantara in Numbers is a national statistics site for Indonesia: 18 headline indicators, five-year series, the 12 most populous provinces and a full sources page, in eight hash-routed sections with working charts and controls. Every figure is a published statistic and names its source and year on the page — BPS, the World Bank, the UN, the Ministry of Health and APJII.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a browser. The site is plain static files under `app/` — no build step, no framework, no network request.

## What is inside

- `app/index.html` — the shell: header, navigation, footer.
- `app/data.js` — every figure, series, province and source.
- `app/charts.js` — hand-rolled SVG bar, line, donut and comparison charts.
- `app/app.js` — the router, the eight pages and the controls.
- `app/style.css` — navy, teal and amber on warm paper, with a phone layout.
- `main.ts` — the hand-in program: copies `app/` and `screenshots/` and writes `dossier.json`.
- `screenshots/` — four real renders of the running site, desktop and phone.

## Controls that work

- Overview: growth line chart and GDP-by-sector donut.
- Population: a year slider over 2020–2024 that moves the headline figure.
- Economy: a growth/inflation switcher that redraws the chart.
- Provinces: search, sort, click-a-row detail, and CSV download.
- Data: search across all 18 indicators, and CSV download.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=tzsn25v9&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
