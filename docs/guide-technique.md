# Guide technique (prototype API)

## Architecture API

- Runtime: Node.js + Express + TypeScript.
- Validation d'entrée: Zod.
- Organisation par domaines:
  - `modules/flight`: calcul VFR, E6B, plan ICAO.
  - `modules/weather`: METAR, NOTAM (mock).
  - `modules/ops`: checklists/logbook/community (store mémoire).
  - `modules/account`: coffre-fort chiffré (AES-256-GCM).

## Flux fonctionnels clés

1. `POST /api/vfr/route`: calcule legs et totaux.
2. `POST /api/vfr/icao-flight-plan`: génère les items ICAO principaux.
3. `POST /api/tools/e6b`: retourne correction de vent + cap magnétique.
4. `GET /api/notam/:aerodrome`: retourne NOTAM pertinents (mock).
5. `POST /api/ops/logbook` + `GET /api/ops/logbook/stats`: trace et analyse des vols.
6. `GET|POST /api/community/posts`: flux communautaire de base.
7. `POST /api/vfr/mass-balance`: calcul masse/centrage.
8. `POST /api/vault/documents` + `/decrypt`: coffre-fort documents chiffrés.
9. `GET /api/system/export`: export de l'état persistant courant.

## Limites actuelles

- Persistance locale JSON (`data/aerozou-store.json`) pour les modules ops/vault (prototype mono-instance).
- NOTAM en mock (pas encore branché EAD Basic).
- Assistant IA en mode simulation (pas d'appel LLM réel).

## Next steps techniques

- Ajouter PostgreSQL + migrations.
- Ajouter couche cache (Redis) pour météo/NOTAM.
- Intégrer authentification JWT + RBAC.
- Introduire versionnement API (`/api/v1`).
