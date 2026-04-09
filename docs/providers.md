# Fournisseurs de données (ciblés)

## Référentiels aéronautiques

- **OpenAIP**: aérodromes, espaces aériens.
- **OurAirports**: métadonnées d'aérodromes/pistes, complémentaire.

## Météo

- **NOAA**: METAR/TAF + produits de prévision.
- **AVWX**: agrégation/décodage aviation météo.

## NOTAM

- **Eurocontrol EAD Basic**: source NOTAM officielle (selon droits d'accès).

## Stratégie d'intégration

- Adapters isolés par fournisseur.
- Normalisation vers un schéma interne commun.
- Cache court pour METAR/TAF et cache ciblé pour NOTAM.
- Journalisation de fraîcheur des données (`fetchedAt`, `source`).
