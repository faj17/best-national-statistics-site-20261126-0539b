// serve.ts — serve app/ locally so the site can be opened in a browser
// while it is built (Node 22, standard library only).
//
//   node serve.ts            serves http://localhost:8080
//   node serve.ts --port 9000   serves http://localhost:9000
//
// It answers only files inside app/, sends the content type a browser
// needs for each suffix, and does nothing else: this is a development
// convenience for screenshots and clicking through, not a public server.

import { readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

/* app/ sits beside this file. */
const appDir = resolve(fileURLToPath(new URL("./app", import.meta.url)));

/* The port: --port <n> wins, anything unusable falls back to 8080. */
function pickPort(): number {
  const flagAt = process.argv.indexOf("--port");
  if (flagAt === -1) return 8080;
  const wanted = Number(process.argv[flagAt + 1]);
  if (Number.isInteger(wanted) && wanted > 0 && wanted < 65536) return wanted;
  return 8080;
}

const port = pickPort();

/* Suffix to content type; anything unknown is served as plain bytes. */
function contentType(file: string): string {
  const types: Record<string, string> = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
  };
  return types[extname(file).toLowerCase()] ?? "application/octet-stream";
}

const server = createServer((request, response) => {
  let path = "/";
  try {
    path = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
  } catch {
    response.writeHead(400);
    response.end("bad request");
    return;
  }
  if (path.endsWith("/")) path += "index.html";

  /* Refuse any path that escapes app/, then read and answer the file. */
  const target = resolve(join(appDir, path));
  if (target !== appDir && !target.startsWith(appDir + sep)) {
    response.writeHead(403);
    response.end("forbidden");
    return;
  }
  let body: Buffer;
  try {
    if (!statSync(target).isFile()) throw new Error("not a file");
    body = readFileSync(target);
  } catch {
    response.writeHead(404);
    response.end("not found");
    return;
  }
  response.writeHead(200, { "content-type": contentType(target), "cache-control": "no-store" });
  response.end(body);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`app/ is on http://localhost:${port}`);
});
