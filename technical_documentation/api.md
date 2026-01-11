# **Flashcards RESTful API**

## **Utilisation de l'API**

## Authentification

### Se connecter

Se connecter à son compte. Retourne les informations de l'utilisateur et un token valable 24 heures qui permet l'accès aux autres routes de l'API.

```http
POST /auth/login
```

Type d’authentification : **Publique** (aucun token requis)

##### Body:

| Paramètre  |   Type   | Description  |
| ---------- | :------: | :----------: |
| `email`    | `String` | **Required** |
| `password` | `String` | **Required** |

```json
{
  "email": "pierre.dupont@gmail.com",
  "password": "Password1234"
}
```

##### Response:

```json
{
  "message": "User logged.",
  "user": {
    "idUser": "c06fa4a8-19bf-4c18-9673-b1a47ef11b0d",
    "email": "pierre.dupont@gmail.com",
    "firstname": "Pierre",
    "lastname": "Dupont"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njc4MjM2MzEsImV4cCI6MTc2NzkxMDAzMX0.ecOPWNoR0FjmNEqte4WZ3ik7VbFDCqnATCF_fNjMpSs"
}
```

### S'inscrire

Se créer un compte. Retourne les informations de l'utilisateur et un token valable 24 heures qui permet l'accès aux autres routes de l'API.

```http
POST /auth/register
```

Type d’authentification : **Publique** (aucun token requis)

##### Body:

| Paramètre   |   Type   | Description  |
| ----------- | :------: | :----------: |
| `email`     | `String` | **Required** |
| `firstname` | `String` | **Required** |
| `lastname`  | `String` | **Required** |
| `password`  | `String` | **Required** |

```json
{
  "email": "pierre.dupont@gmail.com",
  "firstname": "Pierre",
  "lastname": "Dupont",
  "password": "Password1234"
}
```

##### Response:

```json
{
  "message": "User created.",
  "user": [
    {
      "idUser": "4a25e7b0-f5d9-4265-bd6d-1f42de500e78",
      "role": "USER",
      "email": "pierre.dupont@gmail.com",
      "firstname": "Pierre",
      "lastname": "Dupont"
    }
  ],
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njc4MjM2MzEsImV4cCI6MTc2NzkxMDAzMX0.ecOPWNoR0FjmNEqte4WZ3ik7VbFDCqnATCF_fNjMpSs"
}
```

## Gestion des collections

### Créer une collection

Créer une collection avec un titre, une description et une visibilité (Privée ou Publique). Retourne les informations de la collection créée.

```http
POST /collections
```

Type d’authentification : **Privée** (token requis)

##### Body:

| Paramètre     |   Type   |            Description            |
| ------------- | :------: | :-------------------------------: |
| `title`       | `String` |           **Required**            |
| `description` | `String` |           **Required**            |
| `visibility`  | `String` | **Required** [`PUBLIC`,`PRIVATE`] |

```json
{
  "title": "Tutos Blender",
  "description": "Des tutos Blender détaillés et accessibles.",
  "visibility": "PUBLIC"
}
```

##### Response:

```json
{
  "message": "Collection created successfully.",
  "collection": [
    {
      "idCollection": "3ff81de4-20d9-41e3-8665-70d844c9d303",
      "title": "Tutos Blender",
      "description": "Des tutos Blender détaillés et accessibles.",
      "visibility": "PUBLIC",
      "createdAt": "2026-01-08T21:12:18.000Z",
      "updatedAt": "2026-01-08T21:12:18.000Z",
      "idUser": "4a25e7b0-f5d9-4265-bd6d-1f42de500e78"
    }
  ]
}
```

### Consulter une collection

Consulter une collection avec son identifiant. Retourne les informations de la collection.

```http
GET /collections/:idCollection
```

Type d’authentification : **Privée** (token requis)

##### Params:

| Paramètre      |  Type  | Description  |
| -------------- | :----: | :----------: |
| `idCollection` | `UUID` | **Required** |

##### Response:

```json
{
  "idCollection": "3ff81de4-20d9-41e3-8665-70d844c9d303",
  "title": "Tutos Blender",
  "description": "Des tutos Blender détaillés et accessibles.",
  "visibility": "PUBLIC",
  "createdAt": "2026-01-08T21:12:18.000Z",
  "updatedAt": "2026-01-08T21:12:18.000Z",
  "idUser": "4a25e7b0-f5d9-4265-bd6d-1f42de500e78"
}
```

### Lister ses propres collections

Lister les collections du compte connecté. Retourne les informations des collections de l'utilisateur.

```http
GET /collections
```

Type d’authentification : **Privée** (token requis)

##### Response:

```json
[
  {
    "idCollection": "65b48049-cbad-4127-81a3-efaf08f363db",
    "title": "Verbes irréguliers en Anglais",
    "description": "Apprend les verbes irréguliers.",
    "visibility": "PRIVATE",
    "createdAt": "2025-12-18T14:13:47.000Z",
    "updatedAt": "2025-12-18T14:13:47.000Z",
    "idUser": "4a25e7b0-f5d9-4265-bd6d-1f42de500e78"
  },
  {
    "idCollection": "3ff81de4-20d9-41e3-8665-70d844c9d303",
    "title": "Tutos Blender",
    "description": "Des tutos Blender détaillés et accessibles.",
    "visibility": "PUBLIC",
    "createdAt": "2026-01-08T21:12:18.000Z",
    "updatedAt": "2026-01-08T21:12:18.000Z",
    "idUser": "4a25e7b0-f5d9-4265-bd6d-1f42de500e78"
  }
]
```

### Rechercher des collections publiques

Rechercher des collections publiques par le titre. Retourne les collections dont le titre contient les caractères donnés.

```http
GET /collections/search?title=
```

Type d’authentification : **Privée** (token requis)

##### Query:

| Paramètre |   Type   | Description  |
| --------- | :------: | :----------: |
| `title`   | `String` | **Required** |

##### Response:

```json
{
  "collections": [
    {
      "idCollection": "307d17ce-7371-4060-9586-c72d990e7382",
      "title": "Verbes irréguliers en Anglais",
      "description": "Les verbes irréguliers en Anglais : trouver la conjugaison et la définition.",
      "visibility": "PUBLIC",
      "createdAt": "2026-01-10T16:28:08.000Z",
      "updatedAt": "2026-01-10T16:28:08.000Z",
      "idUser": "f7336708-1f1d-4994-81af-da457cb5aa42"
    },
    {
      "idCollection": "2745feca-0d99-4ddc-ae0b-fb2f23fe6e70",
      "title": "Culture Générale",
      "description": "Questions de culture générale.",
      "visibility": "PUBLIC",
      "createdAt": "2026-01-10T16:28:08.000Z",
      "updatedAt": "2026-01-10T16:28:08.000Z",
      "idUser": "f7336708-1f1d-4994-81af-da457cb5aa42"
    },
    {
      "idCollection": "e1178576-56d3-4af8-aacd-52d9fd5e57ee",
      "title": "Capitale du monde",
      "description": "Questions sur les capitales du monde. #GEOGRAPHIE #CAPITALE #MONDE",
      "visibility": "PUBLIC",
      "createdAt": "2026-01-10T16:28:08.000Z",
      "updatedAt": "2026-01-10T16:28:08.000Z",
      "idUser": "81eb86b3-7217-4552-8e8e-b92013d9303b"
    }
  ]
}
```

### Modifier une collection

Modifier une collection avec son identifiant. On peut y modifier son titre, sa description et sa visibilité. Seul le propriétaire de la collection ou un administrateur peut la modifier.

```http
PATCH /collections/:idCollection
```

Type d’authentification : **Privée** (token requis)

##### Params:

| Paramètre      |  Type  | Description  |
| -------------- | :----: | :----------: |
| `idCollection` | `UUID` | **Required** |

##### Body:

| Paramètre     |   Type   |     Description      |
| ------------- | :------: | :------------------: |
| `title`       | `String` |                      |
| `description` | `String` |                      |
| `visibility`  | `String` | [`PUBLIC`,`PRIVATE`] |

```json
{
  "description": "Des tutos Blender détaillés mais plus accessibles car la collection devient privée.",
  "visibility": "PRIVATE"
}
```

###### Response:

```json
{
  "message": "Collection 3ff81de4-20d9-41e3-8665-70d844c9d303 updated successfully"
}
```

### Supprimer une collection

Supprimer une collection avec son identifiant. Seul le propriétaire de la collection ou un administrateur peut la supprimer.

```http
DEL /collections/:idCollection
```

Type d’authentification : **Privée** (token requis)

| Paramètre      |  Type  | Description  |
| -------------- | :----: | :----------: |
| `idCollection` | `UUID` | **Required** |

##### Response:

```json
{
  "message": "Collection 307d17ce-7371-4060-9586-c72d990e7382 deleted successfully."
}
```

## Gestion des flashcards

### Créer une flashcard

Créer une flashcard. A besoin de textes pour le recto et le verso de la flashcards, et de l'identifiant de la collection. Les URLS sont optionnelles.

```http
POST /flashcards
```

Type d’authentification : **Privée** (token requis)

##### Body:

| Paramètre      |      Type       |       Description       |
| -------------- | :-------------: | :---------------------: |
| `rectoText`    |    `String`     |      **Required**       |
| `versoText`    |    `String`     |      **Required**       |
| `urls`         | `Array<Object>` | {"side":..., "url":...} |
| `idCollection` |     `UUID`      |      **Required**       |

```json
{
  "rectoText": "Manger",
  "versoText": "Eat Ate Eaten",
  "urls": [
    {
      "side": "VERSO",
      "url": "https://www.reverso.net"
    }
  ],
  "idCollection": "307d17ce-7371-4060-9586-c72d990e7382"
}
```

##### Response:

```json
{
  "message": "Flashcard created successfully.",
  "flashcard": {
    "idFlashcard": "01e8733f-6b6a-40c1-80e5-42dd1bc6302e",
    "rectoText": "Tomber",
    "versoText": "fall - fell - fallen",
    "idCollection": "307d17ce-7371-4060-9586-c72d990e7382"
  },
  "urls": []
}
```

### Consulter une flashcard

Consulter une flashcard par son identifiant. Retourne les informations de la flashcard et ses URLS (si elle en a).

```http
GET /flashcards/:idFlashcard
```

Type d’authentification : **Privée** (token requis)

##### Params:

| Paramètre     |  Type  | Description  |
| ------------- | :----: | :----------: |
| `idFlashcard` | `UUID` | **Required** |

##### Response:

```json
{
  "flashcard": {
    "idFlashcard": "d7c6fedb-5879-49f3-9c87-f188cc6e7b08",
    "rectoText": "MANGER",
    "versoText": "Eat, Ate, Eaten",
    "idCollection": "65b48049-cbad-4127-81a3-efaf08f363db"
  },
  "urls": [
    {
      "idUrl": "4882ca4a-923e-4ba5-a5d5-901ffd09cd71",
      "side": "VERSO",
      "url": "https://www.theconjugator.com/php5/index.php?l=fr&v=eat"
    }
  ]
}
```

### Lister les flashcards d’une collection

Lister les flashcards par l'identifiant d'une collection. Accessible à tous si la collection est publique, sinon seul le propriétaire de la collection privée ou un admin peuvent obtenir les informations.

```http
GET /flashcards/collection/:idCollection
```

Type d’authentification : **Privée** (token requis)

##### Params:

| Paramètre      |  Type  | Description  |
| -------------- | :----: | :----------: |
| `idCollection` | `UUID` | **Required** |

##### Response:

```json
{
  "flashcards": [
    {
      "flashcard": {
        "idFlashcard": "d7c6fedb-5879-49f3-9c87-f188cc6e7b08",
        "rectoText": "MANGER",
        "versoText": "Eat, Ate, Eaten",
        "idCollection": "65b48049-cbad-4127-81a3-efaf08f363db"
      },
      "urls": [
        {
          "idUrl": "4882ca4a-923e-4ba5-a5d5-901ffd09cd71",
          "side": "VERSO",
          "url": "https://www.theconjugator.com/php5/index.php?l=fr&v=eat"
        }
      ]
    },
    {
      "flashcard": {
        "idFlashcard": "3991ecd8-699d-4464-9037-cf5b04c4cd6b",
        "rectoText": "Oublier",
        "versoText": "forget - forgot, forgotten",
        "idCollection": "307d17ce-7371-4060-9586-c72d990e7382"
      },
      "urls": []
    }
  ]
}
```

### Récupérer les flashcards à réviser d’une collection

Lister les flashcards à réviser par l'utilisateur d'une collection via son identifiant. Retourne les informations des flashcards.

```http
GET /flashcards/collection/:idCollection/to-review
```

Type d’authentification : **Privée** (token requis)

##### Params:

| Paramètre      |  Type  | Description  |
| -------------- | :----: | :----------: |
| `idCollection` | `UUID` | **Required** |

##### Response:

```json
{
  "flashcards": [
    {
      "idFlashcard": "e63bb66f-faa9-433a-becb-6258fccef598",
      "rectoText": "Cousine Paternelle",
      "versoText": "Emma",
      "idCollection": "fe7bbd32-5ce7-497e-84b0-b5c524f83dec"
    }
  ]
}
```

### Modifier une flashcard

```http
PATCH /flashcards/:idFlashcard
```

Type d’authentification : **Privée** (token requis)

##### Params:

| Paramètre     |  Type  | Description  |
| ------------- | :----: | :----------: |
| `idFlashcard` | `UUID` | **Required** |

##### Body:

| Paramètre   |      Type       |       Description       |
| ----------- | :-------------: | :---------------------: |
| `rectoText` |    `String`     |                         |
| `versoText` |    `String`     |                         |
| `urls`      | `Array<Object>` | {"side":..., "url":...} |

```json
{
  "rectoText": "MANGER",
  "versoText": "EAT ATE EATEN",
  "urls": [
    {
      "side": "VERSO",
      "url": "https://www.reverso.net"
    }
  ]
}
```

##### Response:

```json
{
  "message": "Flashcard d7c6fedb-5879-49f3-9c87-f188cc6e7b08 updated successfully."
}
```

### Supprimer une flashcard

Suppprimer une flashcard avec son identifiant. Supprime aussi les revues associées.

```http
DEL /flashcards/:idFlashcard
```

Type d’authentification : **Privée** (token requis)

##### Params:

| Paramètre     |  Type  | Description  |
| ------------- | :----: | :----------: |
| `idFlashcard` | `UUID` | **Required** |

##### Response:

```json
{
  "message": "Flashcard f57e7196-22bc-4842-bcb4-196617eed463 deleted successfully."
}
```

### Réviser une flashcard

Réviser une flashcard d'un utilisateur par son identifiant. Niveau 1 = 1 jour, Niveau 2 = 2 jours, Niveau 3 = 4 jours, Niveau 4 = 8 jours, 5 = 16 jours.

```http
PUT flashcards/review/:idFlashcard
```

Type d’authentification : **Privée** (token requis)

###### Params:

| Paramètre     |  Type  | Description  |
| ------------- | :----: | :----------: |
| `idFlashcard` | `UUID` | **Required** |

###### Body:

| Paramètre |   Type   |            Description             |
| --------- | :------: | :--------------------------------: |
| `level`   | `String` | **Required** ["1","2","3","4","5"] |

```json
{
  "level": "3"
}
```

###### Response:

```json
{
  "message": "Flashcard review updated.",
  "review": [
    {
      "idReview": "295b97bb-7554-4923-88ae-eded376ec544",
      "currentLevel": 3,
      "lastReview": "2026-01-11T16:52:34.000Z",
      "nextReview": "2026-01-15T16:52:34.000Z",
      "idUser": "81eb86b3-7217-4552-8e8e-b92013d9303b",
      "idFlashcard": "e63bb66f-faa9-433a-becb-6258fccef598"
    }
  ]
}
```

## Gestion des utilisateurs

### Lister les utilisateurs

Lister tous les utilisateurs. Retourne la liste de tous les utilisateurs, triés par ordre de création (le plus récent en premier).

```http
GET /users
```

Type d’authentification : **ADMIN ONLY** (token et role admin requis)

##### Response:

```json
{
  "users": [
    {
      "idUser": "f7336708-1f1d-4994-81af-da457cb5aa42",
      "email": "cassandre.yontailleux@gmail.com",
      "firstname": "Cassandre",
      "lastname": "Yon-Tailleux",
      "createdAt": "2026-01-10T16:28:08.000Z",
      "updatedAt": "2026-01-10T16:28:08.000Z",
      "role": "ADMIN"
    },
    {
      "idUser": "882e5664-8b19-4079-adb6-11d4756cd298",
      "email": "philomene.duclos14890@gmail.com",
      "firstname": "Philomène",
      "lastname": "Duclos",
      "createdAt": "2026-01-10T16:28:08.000Z",
      "updatedAt": "2026-01-10T16:28:08.000Z",
      "role": "USER"
    },
    {
      "idUser": "40030d41-d110-4c06-a088-ab883dcb828b",
      "email": "jp75016@gmail.com",
      "firstname": "Jean-Paul",
      "lastname": "Flandin",
      "createdAt": "2026-01-10T16:28:08.000Z",
      "updatedAt": "2026-01-10T16:28:08.000Z",
      "role": "USER"
    }
  ]
}
```

### Consulter un utilisateur

Consulter un utilisateur par son identifiant. Retourne les informations de l'utilisateur, ses collections et ses revues.

```http
GET /user/:idUser
```

Type d’authentification : **ADMIN ONLY** (token et role admin requis)

##### Params:

| Paramètre |  Type  | Description  |
| --------- | :----: | :----------: |
| `idUser`  | `UUID` | **Required** |

##### Response:

```json
{
  "user": {
    "idUser": "f7336708-1f1d-4994-81af-da457cb5aa42",
    "email": "cassandre.yontailleux@gmail.com",
    "firstname": "Cassandre",
    "lastname": "Yon-Tailleux",
    "createdAt": "2026-01-10T16:28:08.000Z",
    "updatedAt": "2026-01-10T16:28:08.000Z",
    "role": "ADMIN"
  },
  "collections": [
    {
      "idCollection": "307d17ce-7371-4060-9586-c72d990e7382",
      "title": "Verbes irréguliers en Anglais",
      "description": "Les verbes irréguliers en Anglais : trouver la conjugaison et la définition.",
      "visibility": "PUBLIC",
      "createdAt": "2026-01-10T16:28:08.000Z",
      "updatedAt": "2026-01-10T16:28:08.000Z",
      "idUser": "f7336708-1f1d-4994-81af-da457cb5aa42"
    },
    {
      "idCollection": "2745feca-0d99-4ddc-ae0b-fb2f23fe6e70",
      "title": "Culture Générale",
      "description": "Questions de culture générale.",
      "visibility": "PUBLIC",
      "createdAt": "2026-01-10T16:28:08.000Z",
      "updatedAt": "2026-01-10T16:28:08.000Z",
      "idUser": "f7336708-1f1d-4994-81af-da457cb5aa42"
    }
  ],
  "reviewsResult": [
    {
      "idReview": "fe3ebafe-4863-4f74-b703-901577d3aa2c",
      "currentLevel": 5,
      "lastReview": "2026-01-10T16:28:08.000Z",
      "nextReview": "2026-01-26T16:28:08.000Z",
      "idUser": "f7336708-1f1d-4994-81af-da457cb5aa42",
      "idFlashcard": "01e8733f-6b6a-40c1-80e5-42dd1bc6302e"
    }
  ]
}
```

### Supprimer un utilisateur

Supprimer un utilisateur par son identifiant. Supprime en cascade ses collections, ses flashcards, ses urls et ses reviews. Les collections et les flashcards supprimées suppriment aussi les revues des autres utilisateurs.

```http
DEL /user/:idUser
```

Type d’authentification : **ADMIN ONLY** (token et role admin requis)

##### Params:

| Paramètre |  Type  | Description  |
| --------- | :----: | :----------: |
| `idUser`  | `UUID` | **Required** |

##### Response:

```json
{
  "message": "User 882e5664-8b19-4079-adb6-11d4756cd298 deleted successfully."
}
```

## **Schéma entité-relation de la base de données**

![Alt text](database_schema.png)
