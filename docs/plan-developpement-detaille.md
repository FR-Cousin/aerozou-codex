# Plan de développement détaillé (Aérozou)

## 1) Priorités produit

1. **VFR core** (prototype actif): route, météo/NOTAM, outils pilotes, logbook.
2. **Fiabilisation**: cache, persistance, authentification et sécurité.
3. **UX multi-support**: PWA + mobile.
4. **IFR**: SID/STAR/approches, contraintes altitude/vitesse.
5. **Communauté avancée** et intégrations embarquées.

## 2) Répartition des rôles (agents)

### Chef de projet
- Maintient backlog priorisé (VFR puis IFR).
- Définit les contrats API cross-modules.
- Valide conformité fonctionnelle aux besoins pilotes.

### Codeur
- Implémente API modulaire (flight/weather/notam/ops/assistant/auth).
- Intègre les fournisseurs externes (OpenAIP, NOAA, EAD Basic).
- Développe la PWA et l'app mobile selon maquettes.

### Testeur
- Tests unitaires (calculs, décodage, validation).
- Tests d'intégration API (flux route, logbook, checklists).
- Tests fonctionnels UX (web/mobile), accessibilité, régression.

### Designer
- Système de design lisible en vol (contraste + éléments tactiles larges).
- Maquettes responsive smartphone/tablette/PWA.
- Bibliothèque de composants réutilisables.

### Agent de déploiement
- Vérifie la qualité (lint/tests/review) avant fusion.
- Gère versioning, tags et publication GitHub.
- Déclenche CI/CD et notifie l'équipe.

## 3) Jalons livrables

### Jalon A (atteint) — Prototype API VFR
- Calcul route VFR + plan ICAO + E6B.
- METAR decode + NOTAM mock.
- Checklists, logbook, stats, assistant stub.

### Jalon B — Données réelles + persistance
- PostgreSQL + schémas métiers.
- Adapters fournisseurs + cache.
- Authentification et coffre-fort documents.

### Jalon C — PWA et mobile
- Planificateur cartographique complet.
- Navigation en vol + overlays météo/NOTAM.
- Expérience utilisateur validée en test terrain.

### Jalon D — IFR & communauté avancée
- SID/STAR/approches.
- Partage de journaux et feed communauté.
- Préparation portage écrans embarqués.
