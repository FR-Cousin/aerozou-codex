# Guide utilisateur (prototype)

## Démarrer

1. Lancer l'API.
2. Vérifier `GET /api/health`.
3. Tester les modules avec un client HTTP (Postman/Insomnia/curl).

## Exemples d'usage

### Planifier un vol VFR
- Appeler `POST /api/vfr/route` avec waypoints, vitesse avion et vent.
- Lire les segments (cap, GS, temps, carburant) et le total.

### Générer un plan ICAO
- Appeler `POST /api/vfr/icao-flight-plan`.
- Copier les items générés vers votre procédure de dépôt.

### Utiliser l'E6B numérique
- Appeler `POST /api/tools/e6b`.
- Lire cap vrai, cap magnétique, GS et angle de correction.

### Check-lists
- `POST /api/ops/checklists` pour créer.
- `PATCH /api/ops/checklists/:id/items/:itemId` pour cocher/décocher.

### Carnet de vol
- `POST /api/ops/logbook` pour enregistrer un vol.
- `GET /api/ops/logbook/stats` pour total heures/vols.

### Communauté
- `POST /api/community/posts` pour publier une note/retour d'aérodrome.
- `GET /api/community/posts` pour lire le fil d'actualité.

## Important sécurité

Ce prototype n'est **pas** certifié avionique et ne remplace pas la documentation officielle, le briefing météo réglementaire ni les procédures des autorités aéronautiques.
