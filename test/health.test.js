import test from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/server.js";

function requestJson(url) {
  return fetch(url).then(async (res) => ({
    status: res.status,
    json: await res.json(),
  }));
}

test("GET /health returns 200 with expected payload", async () => {
  const server = buildApp();
  await new Promise((resolve) => server.listen(0, resolve));

  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;

  const response = await requestJson(`http://127.0.0.1:${port}/health`);

  assert.equal(response.status, 200);
  assert.equal(response.json.status, "ok");
  assert.equal(response.json.service, "aerozou-api");

  await new Promise((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  );
});

test("GET unknown route returns 404", async () => {
  const server = buildApp();
  await new Promise((resolve) => server.listen(0, resolve));

  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;

  const response = await requestJson(`http://127.0.0.1:${port}/unknown`);
  assert.equal(response.status, 404);
  assert.equal(response.json.error, "Not found");

  await new Promise((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  );
});
