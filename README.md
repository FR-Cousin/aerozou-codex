# Aérozou

Aérozou est une application aéronautique tout-en-un pour pilotes, avec montée en puissance **VFR d'abord**, puis **IFR**.

## État actuel du prototype

Le prototype couvre déjà :

- Planification VFR (route multi-segments, cap, GS, temps, carburant).
- Génération d'un plan de vol ICAO (items principaux).
- Outil E6B numérique (correction de vent et cap magnétique).
- Décodage METAR et récupération NOTAM (mock d'intégration).
- Outils pilotes (check-lists + logbook + statistiques) via API.
- Endpoint assistant IA (mode stub, prêt à brancher sur OpenAI/modèle local).

## Structure

- `apps/api` : API Node.js/Express TypeScript.
- `apps/web` : placeholder React PWA (prochain cycle).
- `apps/mobile` : placeholder React Native (prochain cycle).
- `docs/` : documentation produit, technique et roadmap.

## Démarrage rapide

```bash
npm install
npm run dev --workspace @aerozou/api
```

API sur `http://localhost:8080`, base path: `/api`.

## Endpoints clés (prototype)

- `GET /api/health`
- `POST /api/vfr/route`
- `POST /api/vfr/icao-flight-plan`
- `POST /api/tools/e6b`
- `POST /api/weather/metar/decode`
- `GET /api/notam/:aerodrome`
- `GET|POST /api/ops/checklists`
- `PATCH /api/ops/checklists/:id/items/:itemId`
- `GET|POST /api/ops/logbook`
- `GET /api/ops/logbook/stats`
- `GET|POST /api/community/posts`
- `POST /api/assistant/chat`

## Documentation

- Vision/architecture: `docs/architecture.md`
- Fournisseurs de données: `docs/providers.md`
- Roadmap: `docs/roadmap.md`
- Plan détaillé et rôles: `docs/plan-developpement-detaille.md`
- Guide technique API: `docs/guide-technique.md`
- Guide utilisateur (FR): `docs/guide-utilisateur.md`
