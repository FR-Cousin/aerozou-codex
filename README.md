# Aérozou

Aérozou est une application aéronautique tout-en-un pour pilotes, avec montée en puissance **VFR d'abord**, puis **IFR**.

## État actuel du prototype

Le prototype couvre désormais :

- Planification VFR (route multi-segments, cap, GS, temps, carburant).
- Génération d'un plan de vol ICAO (items principaux).
- Outil E6B numérique (correction de vent et cap magnétique).
- Décodage METAR et récupération NOTAM (mock d'intégration).
- Outils pilotes (E6B, check-lists + logbook + statistiques) via API.
- Masse/centrage (calcul masse totale, moment, CG et limites).
- Coffre-fort administratif chiffré (prototype AES-256-GCM).
- Monétisation (endpoint options essai/don/achat/ads discrètes).
- Endpoint assistant IA (mode stub, prêt à brancher sur OpenAI/modèle local).
- Prototype PWA web avec tests rapides: santé API, E6B, METAR, route VFR.
- Persistance locale JSON pour check-lists, logbook, communauté et coffre-fort.

## Structure

- `apps/api` : API Node.js/Express TypeScript.
- `apps/web` : prototype PWA (HTML/CSS/JS).
- `apps/mobile` : placeholder React Native (prochain cycle).
- `docs/` : documentation produit, technique et roadmap.

---

## ✅ Commandes complètes pour tester le code

> Prérequis : Node.js 20+ et Python 3.

### 1) Installer les dépendances

```bash
npm install
```

### 2) Lancer l'API

```bash
npm run dev --workspace @aerozou/api
```

API disponible sur `http://localhost:8080`.

### 3) Vérifier rapidement l'API (important)

```bash
curl http://localhost:8080/
curl http://localhost:8080/api/health
curl http://localhost:8080/api/system/export
```

### 4) Lancer la PWA web (dans un 2e terminal)

Depuis la racine du repo:

```bash
python -m http.server 5173 --directory apps/web
```

Puis ouvrir : `http://localhost:5173`.

### 5) Tester un endpoint métier

Exemple E6B :

```bash
curl -X POST http://localhost:8080/api/tools/e6b \
  -H "Content-Type: application/json" \
  -d '{
    "trueAirspeedKt": 110,
    "courseDeg": 250,
    "windFromDeg": 300,
    "windKt": 20,
    "variationDeg": 2
  }'
```

Exemple calcul VFR :

```bash
curl -X POST http://localhost:8080/api/vfr/route \
  -H "Content-Type: application/json" \
  -d '{
    "waypoints": [
      {"code": "LFBO", "lat": 43.6293, "lon": 1.3633},
      {"code": "LFDH", "lat": 43.6878, "lon": 0.6017},
      {"code": "LFBD", "lat": 44.8283, "lon": -0.7156}
    ],
    "aircraft": {"trueAirspeedKt": 115, "fuelBurnLh": 33},
    "wind": {"directionDeg": 300, "speedKt": 15}
  }'
```

### 6) Lancer les tests unitaires

```bash
npm run test --workspace @aerozou/api
```

---

## ⚠️ Résolution du problème « cannot get / »

Si vous voyez `cannot get /` sur `http://localhost:8080` :

1. Vérifiez que l'API est bien lancée (`npm run dev --workspace @aerozou/api`).
2. Utilisez `http://localhost:8080/` (racine informative) ou `http://localhost:8080/api/health`.
3. Les endpoints métiers sont sous `/api/...`.
4. Pour l'interface web, ouvrez `http://localhost:5173` (et pas `http://localhost:8080`).

---

## Endpoints clés (prototype)

- `GET /api/health`
- `GET /api/system/export`
- `GET /api/monetization/options`
- `POST /api/vfr/route`
- `POST /api/vfr/icao-flight-plan`
- `POST /api/vfr/mass-balance`
- `POST /api/tools/e6b`
- `POST /api/weather/metar/decode`
- `GET /api/notam/:aerodrome`
- `GET|POST /api/ops/checklists`
- `PATCH /api/ops/checklists/:id/items/:itemId`
- `GET|POST /api/ops/logbook`
- `GET /api/ops/logbook/stats`
- `GET|POST /api/community/posts`
- `POST /api/vault/documents`
- `POST /api/vault/documents/:id/decrypt`
- `POST /api/assistant/chat`

## Documentation

- Vision/architecture: `docs/architecture.md`
- Fournisseurs de données: `docs/providers.md`
- Roadmap: `docs/roadmap.md`
- Plan détaillé et rôles: `docs/plan-developpement-detaille.md`
- Guide technique API: `docs/guide-technique.md`
- Guide utilisateur (FR): `docs/guide-utilisateur.md`
