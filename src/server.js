import { createServer } from "node:http";
import { computeE6B } from "./e6b.js";

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new Error("Payload too large"));
      }
    });

    req.on("end", () => {
      if (!data) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });

    req.on("error", reject);
  });
}

function json(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

export function buildApp() {
  return createServer(async (req, res) => {
    if (req.method === "GET" && req.url === "/") {
      json(res, 200, {
        message: "Bienvenue sur Aérozou API",
        availableRoutes: ["GET /health", "POST /tools/e6b"],
      });
      return;
    }

    if (req.method === "GET" && req.url === "/health") {
      json(res, 200, {
        status: "ok",
        service: "aerozou-api",
        version: "item-2",
      });
      return;
    }

    if (req.method === "POST" && req.url === "/tools/e6b") {
      try {
        const body = await readJsonBody(req);
        const required = ["trueAirspeedKt", "courseDeg", "windFromDeg", "windKt"];
        const missing = required.filter((k) => typeof body[k] !== "number");

        if (missing.length > 0) {
          json(res, 400, {
            error: "Validation error",
            hint: `Missing/invalid numeric fields: ${missing.join(", ")}`,
          });
          return;
        }

        const result = computeE6B(body);
        json(res, 200, result);
      } catch (error) {
        json(res, 400, {
          error: "Bad request",
          hint: error instanceof Error ? error.message : "Unknown error",
        });
      }
      return;
    }

    json(res, 404, {
      error: "Not found",
      hint: "Use GET /, GET /health, or POST /tools/e6b",
    });
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
