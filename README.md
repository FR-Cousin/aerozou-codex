# Aérozou — Développement incrémental (Item 1 en cours)

Ce dépôt repart de zéro, **item par item**, pour garantir une base testable et stable.

## ✅ Item 1 implémenté

Objectif de l'item 1 : socle minimal API + endpoint santé.

Contenu livré :
- serveur Node.js minimal (`src/server.js`),
- endpoint `GET /health` retournant HTTP `200` + JSON,
- réponse `404` JSON sur route inconnue,
- tests automatisés Node (`test/health.test.js`).

---

## Manipulations & commandes à jour pour tester le code

### Prérequis
- Node.js 20+

### 1) Installer
```bash
npm install
```

### 2) Lancer en développement
```bash
npm run dev
```

### 3) Vérifier manuellement l'API
```bash
curl http://localhost:8080/health
curl http://localhost:8080/unknown
```

### 4) Lancer les tests automatisés
```bash
npm test
```

### Résultat attendu
- `/health` renvoie `200` avec:
```json
{"status":"ok","service":"aerozou-api","version":"item-1"}
```
- route inconnue renvoie `404` avec indication d'usage.

---

## Cahier des charges complet (consolidé)

### Vision produit
Aérozou est une application aéronautique tout-en-un destinée aux pilotes, avec progression **VFR d'abord**, puis **IFR**.

### Modules fonctionnels cibles
1. **Planification de vol / navigation**
   - sélection de points sur carte vectorielle,
   - calcul caps, altitudes mini, distances, ETA, carburant, masse/centrage,
   - génération plan de vol ICAO,
   - alertes espaces aériens, obstacles, zones temporaires,
   - extension IFR ultérieure (SID/STAR/approches).

2. **Météo & NOTAM temps réel**
   - METAR/TAF, vents, turbulence, nuages, PIREP,
   - NOTAM pertinents par route/aérodrome,
   - fournisseurs cibles : OpenAIP/OurAirports, NOAA/AVWX, Eurocontrol EAD Basic.

3. **Outils pilotes**
   - E6B numérique,
   - check-lists personnalisables,
   - carnet de vol numérique + statistiques + alertes,
   - coffre-fort administratif sécurisé.

4. **Assistant IA en français**
   - questions météo/route/check-lists,
   - explication des choix de route,
   - lecture assistée des check-lists.

5. **Communauté**
   - notes/commentaires sur aérodromes,
   - partage journaux de vol,
   - fil d'actualité.

6. **UX / accessibilité / plateformes**
   - design épuré, contrasté, boutons larges,
   - mode clair/sombre,
   - responsive smartphone/tablette,
   - disponibilité PWA + iOS/Android,
   - architecture extensible vers systèmes embarqués.

7. **Monétisation flexible**
   - app gratuite au départ,
   - essai,
   - dons ou achat unique,
   - publicité discrète optionnelle.

### Architecture cible (améliorée)
- front web : React/PWA,
- mobile : React Native,
- back : Node.js + API modulaire,
- séparation stricte calculs métier / adapters fournisseurs / UI,
- développement incrémental avec tests à chaque item.

### Rôles projet
- **Chef de projet** : priorisation, architecture, conformité aéronautique.
- **Codeur** : implémentation back/front/mobile/intégrations.
- **Testeur** : unitaires, intégration, fonctionnels, compatibilité.
- **Designer** : maquettes, ergonomie en vol, composants réutilisables.
- **Agent de déploiement** : revue qualité, versioning, CI/CD, livraison GitHub.

### Stratégie de livraison incrémentale
- Item 1 : socle API santé (ce livrable).
- Item 2 : outil E6B isolé + tests.
- Item 3 : route VFR (legs + totaux) + tests.
- Item 4 : METAR decode.
- Item 5 : logbook/check-lists.
- Item 6 : NOTAM/adapters.
- Item 7 : IA + communauté.
- Item 8 : UI PWA complète.
- Item 9 : mobile.
- Item 10 : IFR.

Cette approche limite les régressions et permet d'assembler progressivement un produit fiable.
