# Architecture cible Aérozou

## Stack

- **Front-end web**: React + PWA.
- **Mobile**: React Native.
- **Back-end**: Node.js/Express + TypeScript.
- **Cache & queue (étapes suivantes)**: Redis + BullMQ.
- **Base de données (étapes suivantes)**: PostgreSQL + PostGIS.

## Modules fonctionnels

1. Planification VFR (actuel) puis IFR.
2. Météo/NOTAM temps réel (intégration fournisseurs à brancher).
3. Outils pilotes: E6B, check-lists, logbook, coffre-fort.
4. Assistant IA conversationnel (français).
5. Communauté (notes aérodromes, partage de vols).

## Principes d'extensibilité

- API modulaire par domaine (`flight`, `weather`, `notam`, `logbook`, `auth`).
- Contrats de données versionnés (`/api/v1/...`).
- Séparation stricte `provider adapters` / `domain logic`.
- Couches compatibles avec un futur portage avionique (service core sans UI).
