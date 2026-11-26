/* charts.js — hand-rolled SVG charts, no library, no network.
 *
 * One job: turn the series in data.js into SVG strings the views can drop
 * into the page. Every chart labels its axes and values, so a screenshot
 * of a chart reads as a chart without hovering anything.
 */

"use strict";

/* Palette shared by every chart on the site. */
const CHART_COLORS = {
  ink: "#14263f",
  faint: "#5b6b7c",
  grid: "#d9d2c2",
  teal: "#0f766e",
  amber: "#d97706",
  rust: "#b45309",
  slate: "#64748b",
  slices: ["#0f766e", "#d97706", "#14263f", "#2d6a4f", "#7c3aed", "#94a3b8"],
};

/* Escape the few characters that would break an SVG text node. */
function svgText(raw) {
  return String(raw)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* Round a number for a label: integers stay integers, the rest get 1 decimal. */
function chartNum(n) {
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/* Vertical bar chart from [year, value] points. Negative values hang
 * below the zero line, so the 2020 growth dip shows as a dip. */
function barChart(series, opts) {
  const options = opts || {};
  const width = options.width || 640;
  const height = options.height || 300;
  const padL = 52, padR = 14, padT = 18, padB = 34;
  const values = series.points.map((p) => p[1]);
  let top = Math.max(0, ...values);
  let bottom = Math.min(0, ...values);
  if (top === bottom) { top += 1; bottom -= 1; }
  const span = top - bottom;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const yFor = (v) => padT + ((top - v) / span) * plotH;
  const zeroY = yFor(0);
  const slot = plotW / series.points.length;
  const barW = Math.min(54, slot * 0.58);

  let out = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${svgText(series.label)}" xmlns="http://www.w3.org/2000/svg">`;
  /* Gridlines: top, middle, zero. */
  for (const frac of [0, 0.5, 1]) {
    const y = padT + frac * plotH;
    out += `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${width - padR}" y2="${y.toFixed(1)}" stroke="${CHART_COLORS.grid}" stroke-width="1"/>`;
  }
  out += `<line x1="${padL}" y1="${zeroY.toFixed(1)}" x2="${width - padR}" y2="${zeroY.toFixed(1)}" stroke="${CHART_COLORS.ink}" stroke-width="1.5"/>`;
  out += `<text x="${padL - 8}" y="${(padT + 4).toFixed(1)}" text-anchor="end" font-size="12" fill="${CHART_COLORS.faint}">${chartNum(top)}</text>`;
  out += `<text x="${padL - 8}" y="${(padT + plotH / 2 + 4).toFixed(1)}" text-anchor="end" font-size="12" fill="${CHART_COLORS.faint}">${chartNum(top - span / 2)}</text>`;
  out += `<text x="${padL - 8}" y="${(padT + plotH + 4).toFixed(1)}" text-anchor="end" font-size="12" fill="${CHART_COLORS.faint}">${chartNum(bottom)}</text>`;

  series.points.forEach((point, i) => {
    const year = point[0];
    const value = point[1];
    const x = padL + i * slot + (slot - barW) / 2;
    const y = value >= 0 ? yFor(value) : zeroY;
    const h = Math.abs(yFor(value) - zeroY);
    const fill = value < 0 ? CHART_COLORS.rust : (options.color || CHART_COLORS.teal);
    out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${Math.max(h, 2).toFixed(1)}" fill="${fill}" rx="3"/>`;
    const labelY = value >= 0 ? y - 6 : y + h + 14;
    out += `<text x="${(x + barW / 2).toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" font-size="13" font-weight="700" fill="${CHART_COLORS.ink}">${chartNum(value)}</text>`;
    out += `<text x="${(x + barW / 2).toFixed(1)}" y="${height - 10}" text-anchor="middle" font-size="12" fill="${CHART_COLORS.faint}">${year}</text>`;
  });
  out += "</svg>";
  return out;
}

/* Line chart from [year, value] points, with a dot and a value on each. */
function lineChart(series, opts) {
  const options = opts || {};
  const width = options.width || 640;
  const height = options.height || 300;
  const padL = 52, padR = 20, padT = 24, padB = 34;
  const values = series.points.map((p) => p[1]);
  let top = Math.max(...values);
  let bottom = Math.min(...values);
  const pad = (top - bottom) * 0.15 || 1;
  top += pad;
  bottom -= pad;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const xFor = (i) => padL + (i / (series.points.length - 1)) * plotW;
  const yFor = (v) => padT + ((top - v) / (top - bottom)) * plotH;
  const color = options.color || CHART_COLORS.teal;

  let out = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${svgText(series.label)}" xmlns="http://www.w3.org/2000/svg">`;
  for (const frac of [0, 0.5, 1]) {
    const y = padT + frac * plotH;
    out += `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${width - padR}" y2="${y.toFixed(1)}" stroke="${CHART_COLORS.grid}" stroke-width="1"/>`;
  }
  out += `<text x="${padL - 8}" y="${(padT + 4).toFixed(1)}" text-anchor="end" font-size="12" fill="${CHART_COLORS.faint}">${chartNum(top - pad)}</text>`;
  out += `<text x="${padL - 8}" y="${(padT + plotH + 4).toFixed(1)}" text-anchor="end" font-size="12" fill="${CHART_COLORS.faint}">${chartNum(bottom + pad)}</text>`;

  const path = series.points.map((p, i) => `${i === 0 ? "M" : "L"}${xFor(i).toFixed(1)},${yFor(p[1]).toFixed(1)}`).join(" ");
  /* A soft fill under the line, so the shape of the series reads at a glance. */
  const area = `${path} L${xFor(series.points.length - 1).toFixed(1)},${(padT + plotH).toFixed(1)} L${xFor(0).toFixed(1)},${(padT + plotH).toFixed(1)} Z`;
  out += `<path d="${area}" fill="${color}" opacity="0.08"/>`;
  out += `<path d="${path}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
  series.points.forEach((point, i) => {
    const cx = xFor(i);
    const cy = yFor(point[1]);
    out += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="5" fill="#fff" stroke="${color}" stroke-width="3"/>`;
    out += `<text x="${cx.toFixed(1)}" y="${(cy - 12).toFixed(1)}" text-anchor="middle" font-size="13" font-weight="700" fill="${CHART_COLORS.ink}">${chartNum(point[1])}</text>`;
    out += `<text x="${cx.toFixed(1)}" y="${height - 10}" text-anchor="middle" font-size="12" fill="${CHART_COLORS.faint}">${point[0]}</text>`;
  });
  out += "</svg>";
  return out;
}

/* Donut chart from [{name, share}] slices, with a legend underneath. */
function donutChart(slices, opts) {
  const options = opts || {};
  const size = options.size || 300;
  const cx = size / 2;
  const cy = size / 2 - 8;
  const outer = size / 2 - 14;
  const inner = outer * 0.58;
  const total = slices.reduce((sum, s) => sum + s.share, 0);
  let angle = -Math.PI / 2;

  const arc = (start, end, rOut, rIn) => {
    const large = end - start > Math.PI ? 1 : 0;
    const x1 = cx + rOut * Math.cos(start), y1 = cy + rOut * Math.sin(start);
    const x2 = cx + rOut * Math.cos(end), y2 = cy + rOut * Math.sin(end);
    const x3 = cx + rIn * Math.cos(end), y3 = cy + rIn * Math.sin(end);
    const x4 = cx + rIn * Math.cos(start), y4 = cy + rIn * Math.sin(start);
    return `M${x1.toFixed(1)},${y1.toFixed(1)} A${rOut},${rOut} 0 ${large} 1 ${x2.toFixed(1)},${y2.toFixed(1)} L${x3.toFixed(1)},${y3.toFixed(1)} A${rIn},${rIn} 0 ${large} 0 ${x4.toFixed(1)},${y4.toFixed(1)} Z`;
  };

  let out = `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Shares of GDP by sector" xmlns="http://www.w3.org/2000/svg">`;
  slices.forEach((slice, i) => {
    const sweep = (slice.share / total) * Math.PI * 2;
    out += `<path d="${arc(angle, angle + sweep, outer, inner)}" fill="${CHART_COLORS.slices[i % CHART_COLORS.slices.length]}"/>`;
    angle += sweep;
  });
  out += `<text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="26" font-weight="700" fill="${CHART_COLORS.ink}">100%</text>`;
  out += `<text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="12" fill="${CHART_COLORS.faint}">of GDP, 2024</text>`;
  out += "</svg>";

  let legend = `<ul class="legend">`;
  slices.forEach((slice, i) => {
    legend += `<li><span class="swatch" style="background:${CHART_COLORS.slices[i % CHART_COLORS.slices.length]}"></span>${svgText(slice.name)} — <strong>${chartNum(slice.share)}%</strong></li>`;
  });
  legend += "</ul>";
  return out + legend;
}

/* Two horizontal bars comparing two values on one scale. */
function compareBars(first, second, opts) {
  const options = opts || {};
  const width = options.width || 640;
  const max = Math.max(first.value, second.value) * 1.12;
  const rowH = 64;
  const height = rowH * 2 + 24;
  const labelW = 210;

  const row = (item, y, color) => {
    const barW = ((item.value / max) * (width - labelW - 70)).toFixed(1);
    return `<text x="0" y="${y + 22}" font-size="14" fill="${CHART_COLORS.ink}">${svgText(item.label)}</text>` +
      `<rect x="${labelW}" y="${y}" width="${barW}" height="30" fill="${color}" rx="4"/>` +
      `<text x="${labelW + Number(barW) + 10}" y="${y + 21}" font-size="15" font-weight="700" fill="${CHART_COLORS.ink}">${chartNum(item.value)} years</text>`;
  };

  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Mean and expected years of schooling" xmlns="http://www.w3.org/2000/svg">` +
    row(first, 8, CHART_COLORS.teal) + row(second, 8 + rowH, CHART_COLORS.amber) + "</svg>";
}
