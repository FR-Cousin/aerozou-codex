import { createServer } from "node:http";

export function buildApp() {
  return createServer((req, res) => {
    if (req.method === "GET" && req.url === "/health") {
      const payload = JSON.stringify({
        status: "ok",
        service: "aerozou-api",
        version: "item-1",
      });

      res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
      res.end(payload);
      return;
    }

    const payload = JSON.stringify({
      error: "Not found",
      hint: "Use GET /health",
    });
    res.writeHead(404, { "content-type": "application/json; charset=utf-8" });
    res.end(payload);
  });
}

const isMainModule = process.argv[1]
  ? import.meta.url === new URL(`file://${process.argv[1]}`).href
  : false;

if (isMainModule) {
  const port = Number(process.env.PORT ?? 8080);
  const server = buildApp();
  server.listen(port, () => {
    console.log(`[aerozou] listening on http://localhost:${port}`);
  });
}
