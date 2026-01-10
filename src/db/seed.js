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
        firstname: "Maelysandre",
        lastname: "Joret Tailleux",
        password: await bcrypt.hash("Password1234", salt),
      },
      {
        email: "cassys.taillet@gmail.com",
        firstname: "Cassys",
        lastname: "Taillet",
        password: await bcrypt.hash("Password1234", salt),
      },
      {
        email: "berenice56@gmail.com",
        firstname: "Bérénice",
        lastname: "Courtial",
        password: await bcrypt.hash("Password1234", salt),
      },
      {
        email: "philomene.duclos14890@gmail.com",
        firstname: "Philomène",
        lastname: "Duclos",
        password: await bcrypt.hash("Password1234", salt),
      },
      {
        email: "jp75016@gmail.com",
        firstname: "Jean-Paul",
        lastname: "Flandin",
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
      {
        title: "Culture Générale",
        description: "Questions de culture générale.",
        visibility: "PUBLIC",
        idUser: insertedUsers[0].idUser,
      },
      {
        title: "Capitale du monde",
        description:
          "Questions sur les capitales du monde. #GEOGRAPHIE #CAPITALE #MONDE",
        visibility: "PUBLIC",
        idUser: insertedUsers[2].idUser,
      },
      {
        title: "Prénoms des membres de la famille",
        description:
          "Questions sur les membres de ma famille pour que je m'en souvienne",
        visibility: "PRIVATE",
        idUser: insertedUsers[2].idUser,
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
        rectoText: "Oublier",
        versoText: "forget - forgot, forgotten",
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
      {
        rectoText: "En quelle année le mur de Berlin est-il tombé ?",
        versoText: "1989",
        idCollection: insertedCollections[2].idCollection,
      },
      {
        rectoText: "Quel est le plus grand organe du corps humain ?",
        versoText: "La peau",
        idCollection: insertedCollections[2].idCollection,
      },
      {
        rectoText: "Quel est l'animal le plus mortel au monde ?",
        versoText: "Le moustique",
        idCollection: insertedCollections[2].idCollection,
      },
      {
        rectoText: "Suisse",
        versoText: "Berne",
        idCollection: insertedCollections[3].idCollection,
      },
      {
        rectoText: "Nouvelle-Zélande",
        versoText: "Wellington",
        idCollection: insertedCollections[3].idCollection,
      },
      {
        rectoText: "Irlande",
        versoText: "Dublin",
        idCollection: insertedCollections[3].idCollection,
      },
      {
        rectoText: "Vietnam",
        versoText: "Hanoï",
        idCollection: insertedCollections[3].idCollection,
      },
      {
        rectoText: "Philippines",
        versoText: "Manille",
        idCollection: insertedCollections[3].idCollection,
      },
      {
        rectoText: "Bulgarie",
        versoText: "Sofia",
        idCollection: insertedCollections[3].idCollection,
      },
      {
        rectoText: "France",
        versoText: "Paris",
        idCollection: insertedCollections[3].idCollection,
      },
      {
        rectoText: "Grand-Oncle",
        versoText: "Grégoire",
        idCollection: insertedCollections[4].idCollection,
      },
      {
        rectoText: "Cousins Paternels",
        versoText: "Sacha, Hippolyte",
        idCollection: insertedCollections[4].idCollection,
      },
      {
        rectoText: "Cousine Paternelle",
        versoText: "Emma",
        idCollection: insertedCollections[4].idCollection,
      },
      {
        rectoText: "Grand-père Paternel",
        versoText: "Gérard",
        idCollection: insertedCollections[4].idCollection,
      },
      {
        rectoText: "Grand-père Maternel",
        versoText: "Jacques",
        idCollection: insertedCollections[4].idCollection,
      },
      {
        rectoText: "Tantes Maternelle",
        versoText: "Aude, Paulette, Bérénice, Marie-Françoise",
        idCollection: insertedCollections[4].idCollection,
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
      {
        currentLevel: 3,
        nextReview: addDays(4),
        idUser: insertedUsers[2].idUser,
        idFlashcard: insertedFlashcards[18].idFlashcard,
      },
      {
        currentLevel: 2,
        nextReview: addDays(2),
        idUser: insertedUsers[2].idUser,
        idFlashcard: insertedFlashcards[19].idFlashcard,
      },
      {
        currentLevel: 1,
        nextReview: addDays(1),
        idUser: insertedUsers[2].idUser,
        idFlashcard: insertedFlashcards[17].idFlashcard,
      },
      {
        currentLevel: 1,
        nextReview: addDays(1),
        idUser: insertedUsers[4].idUser,
        idFlashcard: insertedFlashcards[5].idFlashcard,
      },
      {
        currentLevel: 1,
        nextReview: addDays(1),
        idUser: insertedUsers[4].idUser,
        idFlashcard: insertedFlashcards[8].idFlashcard,
      },
      {
        currentLevel: 1,
        nextReview: addDays(1),
        idUser: insertedUsers[4].idUser,
        idFlashcard: insertedFlashcards[9].idFlashcard,
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
      {
        side: "RECTO",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Berlinermauer.jpg/330px-Berlinermauer.jpg",
        idFlashcard: insertedFlashcards[5].idFlashcard,
      },
      {
        side: "RECTO",
        url: "https://th.bing.com/th/id/R.5ba4f541e24ee84f6e66cb8c440f4bf4?rik=7BqwdF2ijkQ9kw&pid=ImgRaw&r=0",
        idFlashcard: insertedFlashcards[6].idFlashcard,
      },
    ];
    await db.insert(urlsTable).values(seedUrls);

    console.log("Database seeded successfully !");
  } catch (err) {
    console.log("Seeding database error : ", err);
  }
}

seed();
