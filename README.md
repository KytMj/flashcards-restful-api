## Flashcards RESTful API

# Enoncé :

https://clementcatel.notion.site/R5-05-Projet-de-groupe-2ae3b8266dbb8014b0aac3869c316f7c

# Cours :

https://clementcatel.notion.site/API-RESTful-avec-Express-js-28b3b8266dbb80538538ed332ff276d8

# Instructions d'installation

**Avoir Node.js et npm d'installés**

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
JWT_SECRET=52f3e1c6dc9c0cabc1ce18cb82721823fe93c360bae353624abc6dc2daee9652170ccf870f54fd97a80ca95c181f0b2d7e95d348ab27d8ccecebc9a6fad2036d83ac6a2f883c2239535bbbb172f0bfdefc313117a92f9b49c9e5e6b0b3de5218827aee0f3de22985d6cd2c8076165139ed1217d257b951fe3c68bc39dda97a5d
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
