const API_BASE = "http://localhost:8080/api";

const healthBtn = document.getElementById("health-btn");
const healthOutput = document.getElementById("health-output");
const e6bForm = document.getElementById("e6b-form");
const e6bOutput = document.getElementById("e6b-output");
const metarForm = document.getElementById("metar-form");
const metarOutput = document.getElementById("metar-output");
const routeBtn = document.getElementById("route-btn");
const routeOutput = document.getElementById("route-output");

async function postJson(path, payload) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

healthBtn?.addEventListener("click", async () => {
  healthOutput.textContent = "Chargement...";
  try {
    const res = await fetch(`${API_BASE}/health`);
    const json = await res.json();
    healthOutput.textContent = JSON.stringify(json, null, 2);
  } catch (error) {
    healthOutput.textContent = `Erreur: ${error.message}`;
  }
});

e6bForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  e6bOutput.textContent = "Calcul en cours...";

  const formData = new FormData(e6bForm);
  const payload = {
    trueAirspeedKt: Number(formData.get("tas")),
    courseDeg: Number(formData.get("course")),
    windFromDeg: Number(formData.get("windFrom")),
    windKt: Number(formData.get("windKt")),
    variationDeg: Number(formData.get("variation")),
  };

  try {
    const json = await postJson("/tools/e6b", payload);
    e6bOutput.textContent = JSON.stringify(json, null, 2);
  } catch (error) {
    e6bOutput.textContent = `Erreur: ${error.message}`;
  }
});

metarForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  metarOutput.textContent = "Décodage en cours...";
  const formData = new FormData(metarForm);

  try {
    const json = await postJson("/weather/metar/decode", {
      raw: String(formData.get("rawMetar")),
    });
    metarOutput.textContent = JSON.stringify(json, null, 2);
  } catch (error) {
    metarOutput.textContent = `Erreur: ${error.message}`;
  }
});

routeBtn?.addEventListener("click", async () => {
  routeOutput.textContent = "Calcul en cours...";
  try {
    const json = await postJson("/vfr/route", {
      waypoints: [
        { code: "LFBO", lat: 43.6293, lon: 1.3633 },
        { code: "LFDH", lat: 43.6878, lon: 0.6017 },
        { code: "LFBD", lat: 44.8283, lon: -0.7156 },
      ],
      aircraft: { trueAirspeedKt: 115, fuelBurnLh: 33 },
      wind: { directionDeg: 300, speedKt: 15 },
    });
    routeOutput.textContent = JSON.stringify(json, null, 2);
  } catch (error) {
    routeOutput.textContent = `Erreur: ${error.message}`;
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/public/sw.js").catch(() => undefined);
  });
}
