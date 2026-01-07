## Flashcards RESTful API

# Enoncé :

https://clementcatel.notion.site/R5-05-Projet-de-groupe-2ae3b8266dbb8014b0aac3869c316f7c

# Cours :

https://clementcatel.notion.site/API-RESTful-avec-Express-js-28b3b8266dbb80538538ed332ff276d8

# Utilisation de l'API

# Authentification

# Se connecter

POST /auth/login
Body:

```json
{
  "email": "pierre.dupont@gmail.com",
  "password": "Password1234"
}
```

Response:

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

# S'inscrire

POST /auth/register
Body:

```json
{
  "email": "pierre.dupont@gmail.com",
  "firstname": "Pierre",
  "lastname": "Dupont",
  "password": "Password1234"
}
```

Response:

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

# Gestion des collections

# Créer une collection

# Consulter une collection

# Lister ses propres collections

# Rechercher des collections publiques

# Modifier une collection

# Supprimer une collection

# Gestion des flashcards

# Créer une flashcard

# Consulter une flashcard

GET /flashcards/:idFlashcard
Response:

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

# Lister les flashcards d’une collection

# Récupérer les flashcards à réviser d’une collection

# Modifier une flashcard

PATCH /flashcards/:idFlashcard
Les éléments du body sont optionnels.
Body:

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

Response:

```json
{
  "message": "Flashcard d7c6fedb-5879-49f3-9c87-f188cc6e7b08 updated succesfully."
}
```

# Supprimer une flashcard

# Réviser une flashcard

# Gestion des utilisateurs

# Lister les utilisateurs

# Consulter un utilisateur

# Supprimer un utilisateur
