# Aérozou — redémarrage incrémental

Le code précédent a été supprimé pour repartir sur une base saine et développer **item par item**.

## Item recommandé en premier

**Item 1 : API minimale de santé + socle projet**

Pourquoi :
- c'est le plus petit incrément testable,
- il valide l'environnement de dev,
- il évite de construire des features métier sur une base instable.

### Contenu de l'item 1
- initialisation du repo (structure minimale),
- un serveur API qui démarre,
- endpoint `GET /health` qui répond `200` + JSON,
- un test automatisé de cet endpoint,
- une commande unique pour lancer et tester.

### Critères d'acceptation
- `npm install` fonctionne,
- `npm run dev` démarre sans erreur,
- `curl http://localhost:8080/health` renvoie un JSON attendu,
- `npm test` passe.

Quand vous validez cet item, je passe à l'item 2 (par ex. E6B), puis on assemblera progressivement.
