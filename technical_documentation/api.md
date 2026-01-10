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
{}
```

### Modifier une collection

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

```http
DEL /collections/:idCollection
```

Type d’authentification : **Privée** (token requis)

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

Type d’authentification : **Privée** (token requis)

##### Body:

| Paramètre | Type | Description  |
| --------- | :--: | :----------: |
| `.`       | `.`  | **Required** |

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

```http
GET /flashcards/:idCollection
```

Type d’authentification : **Privée** (token requis)

##### Params:

| Paramètre      |  Type  | Description  |
| -------------- | :----: | :----------: |
| `idCollection` | `UUID` | **Required** |

##### Response:

```json
{}
```

### Récupérer les flashcards à réviser d’une collection

```http
GET /flashcards/:idCollection/to-review
```

Type d’authentification : **Privée** (token requis)

##### Params:

| Paramètre      |  Type  | Description  |
| -------------- | :----: | :----------: |
| `idCollection` | `UUID` | **Required** |

##### Response:

```json
{}
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

```http
???
```

###### Params:

| Paramètre      |  Type  | Description  |
| -------------- | :----: | :----------: |
| `idCollection` | `UUID` | **Required** |

###### Response:

```json
{}
```

## Gestion des utilisateurs

### Lister les utilisateurs

```http
GET /users
```

##### Response:

```json
{}
```

### Consulter un utilisateur

```http
GET /user/:idUser
```

##### Params:

| Paramètre |  Type  | Description  |
| --------- | :----: | :----------: |
| `idUser`  | `UUID` | **Required** |

##### Response:

```json
{}
```

### Supprimer un utilisateur

```http
DEL /user/:idUser
```

##### Params:

| Paramètre |  Type  | Description  |
| --------- | :----: | :----------: |
| `idUser`  | `UUID` | **Required** |

##### Response:

```json
{}
```

## **Schéma entité-relation de la base de données**

![Alt text](database_schema.png)
