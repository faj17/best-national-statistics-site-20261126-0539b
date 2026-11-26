// Small hand-rolled SVG charts. No library: three functions, one job each.
// Every chart is drawn from the data passed in, with labelled axes and values.

const SVGNS = "http://www.w3.org/2000/svg";

function el(tag, attrs, text) {
  const n = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs || {})) n.setAttribute(k, String(v));
  if (text !== undefined && text !== null) n.textContent = text;
  return n;
}

function niceMax(values) {
  const m = Math.max(...values.map(Math.abs));
  if (m <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(m)));
  const f = m / p;
  const step = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
  return step * p;
}

function fmt(v, decimals) {
  return v.toFixed(decimals === undefined ? 1 : decimals);
}

// Vertical bar chart. data: [{label, value}]. options: {unit, color, decimals}
export function barChart(host, data, options) {
  const opt = options || {};
  const W = 640, H = 300, padL = 52, padB = 34, padT = 18, padR = 12;
  host.innerHTML = "";
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": opt.label || "Bar chart" });
  const max = niceMax(data.map((d) => d.value));
  const min = Math.min(0, ...data.map((d) => d.value));
  const lo = min < 0 ? niceMax([-min]) * -1 : 0;
  const iw = W - padL - padR, ih = H - padT - padB;
  const y = (v) => padT + ih * (1 - (v - lo) / (max - lo));
  const zeroY = y(0);
  // gridlines + y labels
  for (let i = 0; i <= 4; i++) {
    const v = lo + ((max - lo) * i) / 4;
    const yy = y(v);
    svg.appendChild(el("line", { x1: padL, y1: yy, x2: W - padR, y2: yy, stroke: "#d8d2c4", "stroke-width": 1 }));
    svg.appendChild(el("text", { x: padL - 8, y: yy + 4, "text-anchor": "end", "font-size": 11, fill: "#5c6b7a" }, fmt(v, 0)));
  }
  const bw = iw / data.length;
  data.forEach((d, i) => {
    const x = padL + i * bw + bw * 0.18;
    const w = bw * 0.64;
    const top = y(Math.max(d.value, 0));
    const bot = d.value >= 0 ? zeroY : y(d.value);
    svg.appendChild(el("rect", { x, y: top, width: w, height: Math.max(1, bot - top), rx: 3, fill: d.value < 0 ? "#b3402e" : (opt.color || "#0e7c7b") }));
    svg.appendChild(el("text", { x: x + w / 2, y: (d.value >= 0 ? top : bot) - 6, "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: "#102a43" }, fmt(d.value, opt.decimals)));
    svg.appendChild(el("text", { x: x + w / 2, y: H - 10, "text-anchor": "middle", "font-size": 12, fill: "#33475c" }, d.label));
  });
  svg.appendChild(el("line", { x1: padL, y1: zeroY, x2: W - padR, y2: zeroY, stroke: "#102a43", "stroke-width": 1.5 }));
  host.appendChild(svg);
}

// Line chart. data: [{label, value}]. options: {color, decimals, unit}
export function lineChart(host, data, options) {
  const opt = options || {};
  const W = 640, H = 300, padL = 56, padB = 34, padT = 22, padR = 16;
  host.innerHTML = "";
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": opt.label || "Line chart" });
  const vals = data.map((d) => d.value);
  const rawHi = Math.max(...vals), rawLo = Math.min(...vals);
  const span = Math.max(rawHi - rawLo, 1);
  // Headroom above the highest point and below the lowest, so value labels
  // never collide with the gridline labels at the chart's edges.
  const hi = rawHi + span * 0.18;
  const lo = rawLo - span * 0.18;
  const iw = W - padL - padR, ih = H - padT - padB;
  const x = (i) => padL + (iw * i) / (data.length - 1);
  const y = (v) => padT + ih * (1 - (v - lo) / (hi - lo));
  for (let i = 0; i <= 4; i++) {
    const v = lo + ((hi - lo) * i) / 4;
    const yy = y(v);
    svg.appendChild(el("line", { x1: padL, y1: yy, x2: W - padR, y2: yy, stroke: "#d8d2c4", "stroke-width": 1 }));
    svg.appendChild(el("text", { x: padL - 8, y: yy + 4, "text-anchor": "end", "font-size": 11, fill: "#5c6b7a" }, fmt(v, opt.decimals === undefined ? 1 : opt.decimals)));
  }
  const pts = data.map((d, i) => `${x(i)},${y(d.value)}`).join(" ");
  svg.appendChild(el("polyline", { points: pts, fill: "none", stroke: opt.color || "#0e7c7b", "stroke-width": 3, "stroke-linejoin": "round", "stroke-linecap": "round" }));
  data.forEach((d, i) => {
    svg.appendChild(el("circle", { cx: x(i), cy: y(d.value), r: 5, fill: "#faf7f2", stroke: opt.color || "#0e7c7b", "stroke-width": 2.5 }));
    // First point's label sits right of the point, the last point's left of
    // it, so neither runs into the y-axis labels; the lowest point's label
    // goes below the point instead of above it.
    const isLow = d.value === rawLo && rawLo < rawHi;
    const lx = i === 0 ? x(i) + 30 : i === data.length - 1 ? x(i) - 30 : x(i);
    const ly = isLow ? y(d.value) + 22 : y(d.value) - 11;
    const anchor = i === 0 ? "start" : i === data.length - 1 ? "end" : "middle";
    svg.appendChild(el("text", { x: lx, y: ly, "text-anchor": anchor, "font-size": 12, "font-weight": 700, fill: "#102a43" }, fmt(d.value, opt.decimals) + (opt.unit || "")));
    svg.appendChild(el("text", { x: x(i), y: H - 10, "text-anchor": "middle", "font-size": 12, fill: "#33475c" }, d.label));
  });
  host.appendChild(svg);
}

// Donut chart with a centre total. data: [{label, value, color}].
export function donutChart(host, data, options) {
  const opt = options || {};
  const W = 320, H = 320, cx = 160, cy = 160, R = 118, r = 74;
  host.innerHTML = "";
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": opt.label || "Donut chart" });
  const total = data.reduce((s, d) => s + d.value, 0);
  let a = -Math.PI / 2;
  data.forEach((d) => {
    const frac = d.value / total;
    const a2 = a + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x1 = cx + R * Math.cos(a), y1 = cy + R * Math.sin(a);
    const x2 = cx + R * Math.cos(a2), y2 = cy + R * Math.sin(a2);
    const ix1 = cx + r * Math.cos(a2), iy1 = cy + r * Math.sin(a2);
    const ix2 = cx + r * Math.cos(a), iy2 = cy + r * Math.sin(a);
    svg.appendChild(el("path", {
      d: `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${r} ${r} 0 ${large} 0 ${ix2} ${iy2} Z`,
      fill: d.color, stroke: "#faf7f2", "stroke-width": 2,
    }));
    const mid = a + (frac * Math.PI * 2) / 2;
    const lx = cx + ((R + r) / 2) * Math.cos(mid), ly = cy + ((R + r) / 2) * Math.sin(mid);
    svg.appendChild(el("text", { x: lx, y: ly + 4, "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: "#ffffff" }, fmt(d.value, 1) + "%"));
    a = a2;
  });
  svg.appendChild(el("text", { x: cx, y: cy - 4, "text-anchor": "middle", "font-size": 26, "font-weight": 700, fill: "#102a43" }, fmt(total, 0) + "%"));
  svg.appendChild(el("text", { x: cx, y: cy + 20, "text-anchor": "middle", "font-size": 12, fill: "#5c6b7a" }, opt.centreLabel || "of employed"));
  host.appendChild(svg);
}
