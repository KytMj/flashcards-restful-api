# **Flashcards RESTful API**

## **Utilisation de l'API**

## Authentification

### Se connecter

```http
POST /auth/login
```

Type d’authentification : **Publique** (aucun token requis)

##### Body:

| Paramètre  |   Type   | Description  |
| ---------- | :------: | :----------: |
| `email`    | `String` | **Required** |
| `password` | `String` | **Required** |

##### Exemple de Body :

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

##### Exemple de Body:

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

```http
POST /collections
```

Type d’authentification : **Privée** (token requis)

| Paramètre     |   Type   |            Description            |
| ------------- | :------: | :-------------------------------: |
| `title`       | `String` |           **Required**            |
| `description` | `String` |           **Required**            |
| `visibility`  | `String` | **Required** [`PUBLIC`,`PRIVATE`] |

##### Body:

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
  "message": "Collection created succesfully.",
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

```http
GET /collections
```

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

```http
GET /collections/search
```

| Paramètre | Type | Description  |
| --------- | :--: | :----------: |
| `.`       | `.`  | **Required** |

##### Query:


##### Response:

```json
{}
```

### Modifier une collection

```http
PATCH /collections/:idCollection
```

| Paramètre | Type | Description  |
| --------- | :--: | :----------: |
| `.`       | `.`  | **Required** |

##### Body:

```json
{}
```

###### Response:

```json
{}
```

### Supprimer une collection

```http
DEL /collections/:idCollection
```

| Paramètre | Type | Description  |
| --------- | :--: | :----------: |
| `.`       | `.`  | **Required** |

##### Body:

```json
{}
```

##### Response:

```json
{}
```

## Gestion des flashcards

### Créer une flashcard

```http
POST /flashcards
```

| Paramètre | Type | Description  |
| --------- | :--: | :----------: |
| `.`       | `.`  | **Required** |

##### Body:

```json
{}
```

##### Response:

```json
{}
```

### Consulter une flashcard

```http
GET /flashcards/:idFlashcard
```

| Paramètre | Type | Description  |
| --------- | :--: | :----------: |
| `.`       | `.`  | **Required** |

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

```http
GET /flashcards/:idCollection
```

| Paramètre | Type | Description  |
| --------- | :--: | :----------: |
| `.`       | `.`  | **Required** |

##### Body:

```json
{}
```

##### Response:

```json
{}
```

### Récupérer les flashcards à réviser d’une collection

```http
GET /flashcards/:idCollection/to-review
```

| Paramètre | Type | Description  |
| --------- | :--: | :----------: |
| `.`       | `.`  | **Required** |

##### Body:

```json
{}
```

##### Response:

```json
{}
```

### Modifier une flashcard

```http
PATCH /flashcards/:idFlashcard
```

| Paramètre | Type | Description |
| --------- | :--: | :---------: |
| `.`       | `.`  |             |

##### Body:

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
  "message": "Flashcard d7c6fedb-5879-49f3-9c87-f188cc6e7b08 updated succesfully."
}
```

### Supprimer une flashcard

```http
DEL /flashcards/:idFlashcard
```

| Paramètre | Type | Description  |
| --------- | :--: | :----------: |
| `.`       | `.`  | **Required** |

##### Body:

```json
{}
```

##### Response:

```json
{}
```

### Réviser une flashcard

```http
????
```

| Paramètre | Type | Description  |
| --------- | :--: | :----------: |
| `.`       | `.`  | **Required** |

###### Body:

```json
{}
```

###### Response:

```json
{}
```

## Gestion des utilisateurs

### Lister les utilisateurs

```http
????
```

| Paramètre | Type | Description  |
| --------- | :--: | :----------: |
| `.`       | `.`  | **Required** |

##### Body:

```json
{}
```

##### Response:

```json
{}
```

### Consulter un utilisateur

```http
GET /user/:idUser
```

| Paramètre | Type | Description  |
| --------- | :--: | :----------: |
| `.`       | `.`  | **Required** |

##### Body:

```json
{}
```

##### Response:

```json
{}
```

### Supprimer un utilisateur

```http
DEL /user/:idUser
```

| Paramètre | Type | Description  |
| --------- | :--: | :----------: |
| `.`       | `.`  | **Required** |

##### Body:

```json
{}
```

##### Response:

```json
{}
```
