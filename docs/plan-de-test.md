# Plan de test, Restful Booker Platform

## Objet

Application testée : [Shady Meadows B&amp;B](https://automationintesting.online), site de réservation de chambres d'hôtes avec une partie publique, une partie administration et une API REST.

Objectif : couvrir les parcours critiques côté client et côté administrateur, en combinant des tests d'interface et des tests d'API.

## Périmètre

| Inclus                                               | Exclu                                        |
| ---------------------------------------------------- | -------------------------------------------- |
| Page d'accueil, liste des chambres                   | Performance et charge                        |
| Formulaire de contact (cas passants et non passants) | Sécurité (hors contrôle d'accès basique) |
| Réservation d'une chambre                           | Rendu mobile (envisagé plus tard)           |
| Connexion à l'administration                        | Paiement (inexistant sur l'appli)            |
| API : chambres, réservations, authentification      |                                              |

## Contraintes de l'environnement

- Site **public et partagé** : d'autres personnes modifient les données en même temps. Les données sont réinitialisées régulièrement.
- Conséquence : les tests ne doivent pas dépendre d'un nombre exact de chambres ou de réservations. Chaque test crée ses propres données quand il en a besoin.

## Stratégie

- **API d'abord pour préparer les données**, interface pour vérifier le parcours utilisateur. Un test d'interface qui a besoin d'une chambre la crée par l'API, c'est plus rapide et plus fiable.
- **Page Object Model** pour isoler les locators.
- **Locators orientés utilisateur** (`getByRole`, `getByLabel`), `getByTestId` en repli.
- Exécution sur Chromium et Firefox, en CI à chaque push.

## Scénarios

Statut : ✅ automatisé, 🔲 à faire

### Interface, côté client

| ID    | Scénario                                                                         | Type        | Statut |
| ----- | --------------------------------------------------------------------------------- | ----------- | ------ |
| UI-01 | La page d'accueil affiche le nom de l'établissement et les chambres              | Passant     | ✅     |
| UI-02 | Envoi du formulaire de contact avec des données valides, message de confirmation | Passant     | ✅     |
| UI-03 | Formulaire de contact vide, messages d'erreur affichés                           | Non passant | ✅     |
| UI-04 | Email invalide dans le formulaire de contact, erreur affichée                    | Non passant | ✅     |
| UI-05 | Réservation d'une chambre de bout en bout, confirmation affichée                | Passant     | 🔲     |
| UI-06 | Réservation sans dates sélectionnées, refusée                                 | Non passant | 🔲     |

### Interface, côté administrateur

| ID     | Scénario                                                                          | Type                  | Statut |
| ------ | ---------------------------------------------------------------------------------- | --------------------- | ------ |
| ADM-01 | Connexion avec des identifiants valides                                            | Passant               | 🔲     |
| ADM-02 | Connexion refusée avec un mauvais mot de passe                                    | Non passant           | 🔲     |
| ADM-03 | Création d'une chambre, visible ensuite sur la page d'accueil                     | Passant               | 🔲     |
| ADM-04 | Le message envoyé via le formulaire de contact apparaît dans la messagerie admin | Passant, bout en bout | 🔲     |

### API

| ID     | Scénario                                                               | Type                    | Statut |
| ------ | ----------------------------------------------------------------------- | ----------------------- | ------ |
| API-01 | `GET /api/room` renvoie la liste des chambres avec un contrat valide  | Passant                 | ✅     |
| API-02 | `POST /api/auth/login` renvoie un token avec des identifiants valides | Passant                 | 🔲     |
| API-03 | `POST /api/auth/login` refusé avec un mauvais mot de passe           | Non passant             | 🔲     |
| API-04 | Création d'une chambre sans authentification, refusée                 | Non passant, sécurité | 🔲     |
| API-05 | Création puis suppression d'une chambre avec authentification          | Passant, CRUD           | 🔲     |

## Anomalies

Les anomalies trouvées sont décrites dans [anomalies.md](anomalies.md).
