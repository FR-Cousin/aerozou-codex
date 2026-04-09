import express from "express";
import router from "./routes.js";

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    service: "aerozou-api",
    status: "ok",
    message: "Bienvenue sur l'API Aérozou. Utilisez /api/health pour vérifier le service.",
    quickLinks: ["/api/health", "/api/monetization/options"],
  });
});

app.use("/api", router);

app.use((_req, res) => {
  res.status(404).json({
    error: "Not found",
    hint: "La racine API est /api. Exemple: GET /api/health",
  });
});

const PORT = Number(process.env.PORT ?? 8080);

app.listen(PORT, () => {
  console.log(`[aerozou-api] listening on :${PORT}`);
});
