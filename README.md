# Tests automatisés Restful Booker Platform

Projet de tests automatisés **UI et API** avec **Playwright** et **TypeScript**, sur l'application de démonstration [Shady Meadows B&amp;B](https://automationintesting.online) (Restful Booker Platform, de Mark Winteringham).

![Tests Playwright](../../actions/workflows/playwright.yml/badge.svg)

## Ce que montre ce projet

- Une démarche QA complète : [plan de test](docs/plan-de-test.md), scénarios passants et non passants, [anomalies](docs/anomalies.md)
- Des tests d'interface multi-navigateurs (Chromium, Firefox)
- Des tests d'API dans le même outil, sans Postman
- Le pattern **Page Object Model**
- Une intégration continue GitHub Actions qui lance les tests à chaque push et publie le rapport HTML

## Structure

```
.
├── docs/                 # Plan de test et anomalies
├── pages/                # Page Objects (locators et actions par page)
├── tests/
│   ├── ui/               # Tests d'interface
│   └── api/              # Tests d'API
├── playwright.config.ts  # Configuration (URL, navigateurs, rapports)
└── .github/workflows/    # Intégration continue
```

## Lancer les tests

Prérequis : Node.js 20 ou plus.

```bash
npm install
npx playwright install chromium firefox

npm test            # tous les tests
npm run test:ui     # interface uniquement
npm run test:api    # API uniquement
npm run report      # ouvrir le rapport HTML
```

## Choix techniques

- **Site partagé** : l'application de démo est publique, ses données changent en permanence. Les tests ne supposent jamais un nombre précis de chambres et créent leurs propres données.
- **Locators orientés utilisateur** (`getByRole`, `getByLabel`) : ils reflètent ce que voit l'utilisateur et résistent mieux aux changements de code.
- **Traces, captures et vidéos conservées seulement en cas d'échec**, pour analyser une erreur sans alourdir les exécutions réussies.
- **Site de démo lent et instable** : selon sa charge, le site met de 5 à 50 secondes à servir ses fichiers, et 10 à 15 secondes à traiter un message de contact. Les délais sont donc adaptés (60 s par test, 10 s par assertion), le parallélisme est limité à 2 navigateurs, et le test de contact se synchronise sur la réponse de l'API (`waitForResponse`) plutôt que sur un délai fixe. Le diagnostic a été fait avec les traces réseau de Playwright.

## Auteure

Sabrina Selve, ingénieure QA certifiée ISTQB Foundation.
