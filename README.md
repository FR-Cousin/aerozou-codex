# Aérozou — Développement incrémental

## État actuel

- ✅ **Item 1**: socle API + `GET /health`.
- ✅ **Item 2**: outil **E6B** via `POST /tools/e6b`.
- ⏭️ Prochain item proposé: calcul route VFR multi-segments.

## Commandes pour tester (à jour)

### 1) Installer
```bash
npm install
```

### 2) Lancer l'API
```bash
npm run dev
```

### 3) Vérifications rapides
```bash
curl http://localhost:8080/
curl http://localhost:8080/health
```

### 4) Tester l'item 2 (E6B)
```bash
curl -X POST http://localhost:8080/tools/e6b \
  -H "Content-Type: application/json" \
  -d '{
    "trueAirspeedKt": 110,
    "courseDeg": 250,
    "windFromDeg": 300,
    "windKt": 20,
    "variationDeg": 2
  }'
```

### 5) Lancer les tests
```bash
npm test
```

## Réponse attendue E6B (exemple)

```json
{
  "headingTrueDeg": 258,
  "headingMagneticDeg": 256,
  "windCorrectionAngleDeg": 7.8,
  "groundSpeedKt": 124.5
}
```

## Cahier des charges consolidé (rappel)

### Vision
Application aéronautique tout-en-un, VFR d'abord puis IFR, sur web PWA + mobile.

### Fonctions cibles
- planification/navigation (caps, distances, ETA, carburant, masse/centrage, plan ICAO),
- météo/NOTAM temps réel,
- outils pilotes (E6B, check-lists, logbook, coffre-fort),
- assistant IA en français,
- fonctions communautaires,
- UX accessible (contraste, large touch targets, dark/light mode),
- monétisation flexible (gratuit + essai + don/achat + pubs discrètes).

### Fournisseurs pressentis
- OpenAIP/OurAirports (aérodromes/espaces),
- NOAA/AVWX (météo),
- Eurocontrol EAD Basic (NOTAM).

### Rôles
Chef de projet, Codeur, Testeur, Designer, Agent de déploiement.

### Stratégie incrémentale
1. Health API (fait)
2. E6B (fait)
3. Route VFR
4. METAR
5. Logbook/check-lists
6. NOTAM/adapters
7. Assistant IA + communauté
8. PWA complète
9. Mobile
10. IFR
