## Flashcards RESTful API

# Enoncé :

https://clementcatel.notion.site/R5-05-Projet-de-groupe-2ae3b8266dbb8014b0aac3869c316f7c

# Cours :

https://clementcatel.notion.site/API-RESTful-avec-Express-js-28b3b8266dbb80538538ed332ff276d8

# Instructions d'installation

**Avoir Node.js et npm d'installé**

Installer zod

```bash
npm install zod
```

Installer Drizzle

```bash
npm install drizzle-orm
```

# Configuration (variables d'environnement)

```
DB_FILE=file:local.db
JWT_SECRET=52f3e1c6dc9cf3de22985d6c616951fe3c68bc39dda97a5d
```

# Lancement du projet

```bash
npm run dev
```

# Initialisation de la base

## Lancer la base de données

```bash
npm run db:studio
```

## Appliquer les modifications de base de données

```bash
npm run db:push
```

## Remplir la base de données

```bash
npm run db:seed
```
