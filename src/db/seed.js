import { db } from "./database.js";
import {
  collectionsTable,
  flashcardsTable,
  usersTable,
  reviewsTable,
  urlsTable,
} from "./schema.js";
import bcrypt from "bcrypt";

async function seed() {
  try {
    console.log("Seeding database...");

    await db.delete(urlsTable);
    await db.delete(reviewsTable);
    await db.delete(flashcardsTable);
    await db.delete(collectionsTable);
    await db.delete(usersTable);

    const salt = await bcrypt.genSalt(12);
    const addDays = (nbDays) => {
      const date = new Date();
      date.setDate(date.getDate() + nbDays);
      return date;
    };

    const seedUsers = [
      {
        email: "cassandre.yontailleux@gmail.com",
        firstname: "Cassandre",
        lastname: "Yon-Tailleux",
        password: await bcrypt.hash("Password1234", salt),
        role: "ADMIN",
      },
      {
        email: "maelys.joret@gmail.com",
        firstname: "Maëlys",
        lastname: "Joret",
        password: await bcrypt.hash("Password1234", salt),
        role: "ADMIN",
      },
      {
        email: "maelysandre.joretailleux@gmail.com",
        firstname: "Casselys",
        lastname: "Yonjoret",
        password: await bcrypt.hash("Password1234", salt),
      },
    ];
    const insertedUsers = await db
      .insert(usersTable)
      .values(seedUsers)
      .returning();

    const seedCollections = [
      {
        title: "Verbes irréguliers en Anglais",
        description:
          "Les verbes irréguliers en Anglais : trouver la conjugaison et la définition.",
        visibility: "PUBLIC",
        idUser: insertedUsers[0].idUser,
      },
      {
        title: "Kubernetes",
        description: "Kubernetes : trouver la définition des mots techniques.",
        visibility: "PRIVATE",
        idUser: insertedUsers[1].idUser,
      },
    ];
    const insertedCollections = await db
      .insert(collectionsTable)
      .values(seedCollections)
      .returning();

    const seedFlashcards = [
      {
        rectoText: "Manger",
        versoText: "eat - ate - eaten",
        idCollection: insertedCollections[0].idCollection,
      },
      {
        rectoText: "Tomber",
        versoText: "fall - fell - fallen",
        idCollection: insertedCollections[0].idCollection,
      },
      {
        rectoText: "Qu'est ce qu'un PVC ?",
        versoText:
          "Persitent Volume Claim : Demande de stockage faite par l'utilisateur pour avoir un accès à un Persitent Volume.",
        idCollection: insertedCollections[1].idCollection,
      },
      {
        rectoText: "Qu'est ce qu'un Pod ?",
        versoText:
          "Un pod est la plus petite unité d'exécution de K8s. Il encapsule une application et est éphémère.",
        idCollection: insertedCollections[1].idCollection,
      },
    ];
    const insertedFlashcards = await db
      .insert(flashcardsTable)
      .values(seedFlashcards)
      .returning();

    const seedReviews = [
      {
        currentLevel: 2,
        nextReview: addDays(2),
        idUser: insertedUsers[2].idUser,
        idFlashcard: insertedFlashcards[0].idFlashcard,
      },
      {
        currentLevel: 5,
        nextReview: addDays(16),
        idUser: insertedUsers[0].idUser,
        idFlashcard: insertedFlashcards[1].idFlashcard,
      },
      {
        currentLevel: 1,
        nextReview: addDays(1),
        idUser: insertedUsers[1].idUser,
        idFlashcard: insertedFlashcards[2].idFlashcard,
      },
    ];
    await db.insert(reviewsTable).values(seedReviews);

    const seedUrls = [
      {
        side: "VERSO",
        url: "https://www.theconjugator.com/php5/index.php?l=fr&v=eat",
        idFlashcard: insertedFlashcards[0].idFlashcard,
      },
      {
        side: "RECTO",
        url: "https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fmatthewpalmer.net%2Fkubernetes-app-developer%2Farticles%2Fkubernetes-networking-guide-beginners.html&ved=0CBUQjRxqFwoTCKif1PvItZEDFQAAAAAdAAAAABAH&opi=89978449",
        idFlashcard: insertedFlashcards[3].idFlashcard,
      },
    ];
    await db.insert(urlsTable).values(seedUrls);

    console.log("Database seeded successfully !");
  } catch (err) {
    console.log("Seeding database error : ", err);
  }
}

seed();
