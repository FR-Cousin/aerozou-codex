# Guide technique (prototype API)

## Architecture API

- Runtime: Node.js + Express + TypeScript.
- Validation d'entrée: Zod.
- Organisation par domaines:
  - `modules/flight`: calcul VFR, E6B, plan ICAO.
  - `modules/weather`: METAR, NOTAM (mock).
  - `modules/ops`: checklists/logbook (store mémoire).

## Flux fonctionnels clés

1. `POST /api/vfr/route`: calcule legs et totaux.
2. `POST /api/vfr/icao-flight-plan`: génère les items ICAO principaux.
3. `POST /api/tools/e6b`: retourne correction de vent + cap magnétique.
4. `GET /api/notam/:aerodrome`: retourne NOTAM pertinents (mock).
5. `POST /api/ops/logbook` + `GET /api/ops/logbook/stats`: trace et analyse des vols.
6. `GET|POST /api/community/posts`: flux communautaire de base.

## Limites actuelles

- Persistance en mémoire (non durable).
- NOTAM en mock (pas encore branché EAD Basic).
- Assistant IA en mode simulation (pas d'appel LLM réel).

## Next steps techniques

- Ajouter PostgreSQL + migrations.
- Ajouter couche cache (Redis) pour météo/NOTAM.
- Intégrer authentification JWT + RBAC.
- Introduire versionnement API (`/api/v1`).
