import test from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/server.js";

function request(url, init) {
  return fetch(url, init).then(async (res) => ({
    status: res.status,
    json: await res.json(),
  }));
}

test("GET / returns welcome JSON", async () => {
  const server = buildApp();
  await new Promise((resolve) => server.listen(0, resolve));

  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  const response = await request(`http://127.0.0.1:${port}/`);

  assert.equal(response.status, 200);
  assert.equal(response.json.message, "Bienvenue sur Aérozou API");

  await new Promise((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  );
});

test("GET /health returns 200 with expected payload", async () => {
  const server = buildApp();
  await new Promise((resolve) => server.listen(0, resolve));

  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;

  const response = await request(`http://127.0.0.1:${port}/health`);

  assert.equal(response.status, 200);
  assert.equal(response.json.status, "ok");
  assert.equal(response.json.service, "aerozou-api");

  await new Promise((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  );
});

test("POST /tools/e6b returns computed values", async () => {
  const server = buildApp();
  await new Promise((resolve) => server.listen(0, resolve));

  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;

  const response = await request(`http://127.0.0.1:${port}/tools/e6b`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      trueAirspeedKt: 110,
      courseDeg: 250,
      windFromDeg: 300,
      windKt: 20,
      variationDeg: 2,
    }),
  });

  assert.equal(response.status, 200);
  assert.equal(typeof response.json.headingTrueDeg, "number");
  assert.equal(typeof response.json.groundSpeedKt, "number");

  await new Promise((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  );
});

test("GET unknown route returns 404", async () => {
  const server = buildApp();
  await new Promise((resolve) => server.listen(0, resolve));

  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;

  const response = await request(`http://127.0.0.1:${port}/unknown`);
  assert.equal(response.status, 404);
  assert.equal(response.json.error, "Not found");

  await new Promise((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  );
});
