import { db } from "../db/database.js";
import {
  collectionsTable,
  flashcardsTable,
  urlsTable,
  reviewsTable,
} from "../db/schema.js";
import { eq, and } from "drizzle-orm";

/**
 * Crée une nouvelle flashcard pour l'utilisateur connecté.
 * Valide que l'utilisateur a accès à la collection et que les URLs sont valides.
 *
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @throws {401} Si l'utilisateur n'a pas accès à la collection
 * @throws {400} Si les URLs sont invalides ou si plus d'une URL par side
 * @throws {500} Si une erreur serveur se produit
 * @returns {Object}
 *
 */
export const postUserFlashcard = async (req, res) => {
  const { userId, userRole } = req.user;
  const { rectoText, versoText, idCollection } = req.body;
  const urls = req.body?.urls ?? null;

  try {
    const [collectionResult] = await db
      .select()
      .from(collectionsTable)
      .where(
        and(
          eq(userId, collectionsTable.idUser),
          eq(idCollection, collectionsTable.idCollection)
        )
      );
    if (!collectionResult && userRole !== "ADMIN") {
      return res.status(401).send({
        error: "Unauthorized collection.",
      });
    }

    const countSides = { recto: 0, verso: 0 };
    if (urls) {
      for (const urlObject of urls) {
        const { side, url } = urlObject;

        if (side === "RECTO") {
          countSides.recto++;
        }
        if (side === "VERSO") {
          countSides.verso++;
        }

        if (countSides.recto > 1 || countSides.verso > 1) {
          return res.status(400).send({
            error: "Only one url is allowed on each side.",
          });
        }

        if (!URL.canParse(url)) {
          return res.status(400).send({
            error: "The text in the url field must be a valid URL.",
          });
        }
      }
    }

    // FlashCard
    const [flashcardResult] = await db
      .insert(flashcardsTable)
      .values({
        rectoText,
        versoText,
        idCollection,
      })
      .returning();

    const addedUrls = [];
    // URL(S)
    if (urls) {
      for (const urlObject of urls) {
        const { side, url } = urlObject;

        const urlResult = await db
          .insert(urlsTable)
          .values({
            side,
            url,
            idFlashcard: flashcardResult.idFlashcard,
          })
          .returning();
        addedUrls.push(urlResult);
      }
    }

    return res.status(201).send({
      message: "Flashcard created successfully.",
      flashcard: flashcardResult,
      urls: addedUrls,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: "Failed to insert Flashcard",
    });
  }
};

/**
 * Récupère une flashcard par son identifiant.
 * Vérifie les permissions d'accès selon la visibilité de la collection.
 *
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @throws {404} Si la flashcard n'existe pas
 * @throws {401} Si l'utilisateur n'a pas accès à la collection (privée)
 * @throws {500} Si une erreur serveur se produit
 * @returns {Object}
 *
 */
export const getFlashcardById = async (req, res) => {
  const { userId, userRole } = req.user;
  const { idFlashcard } = req.params;

  try {
    const [flashcardResult] = await db
      .select()
      .from(flashcardsTable)
      .where(eq(flashcardsTable.idFlashcard, idFlashcard));

    if (!flashcardResult) {
      return res.status(404).send({
        message: `FlashCard ${idFlashcard} not found.`,
      });
    }

    const [collectionResult] = await db
      .select()
      .from(collectionsTable)
      .where(eq(collectionsTable.idCollection, flashcardResult.idCollection));

    if (!collectionResult) {
      return res.status(401).send({
        error: "Flashcard in private collection.",
      });
    }

    if (
      collectionResult?.visibility === "PRIVATE" &&
      userId !== collectionResult.idUser &&
      userRole !== "ADMIN"
    ) {
      return res.status(401).send({
        error: "Unauthorized access.",
      });
    }

    const urlsFlashcard = await db
      .select({
        idUrl: urlsTable.idUrl,
        side: urlsTable.side,
        url: urlsTable.url,
      })
      .from(urlsTable)
      .where(eq(urlsTable.idFlashcard, flashcardResult.idFlashcard));

    return res.status(200).send({
      flashcard: flashcardResult,
      urls: urlsFlashcard,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: "Failed to get flashcard by id",
    });
  }
};

/**
 * Récupère toutes les flashcards d'une collection.
 * Accessible à tous si la collection est publique, sinon seul le propriétaire/admin.
 *
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @throws {404} Si aucune flashcard trouvée
 * @throws {401} Si la collection est privée et l'utilisateur n'a pas accès
 * @throws {500} Si une erreur serveur se produit
 * @returns {Object}
 *
 */
export const getFlashcardsByCollectionId = async (req, res) => {
  const { userId, userRole } = req.user;
  const { idCollection } = req.params;

  try {
    const flashcardList = await db
      .select()
      .from(flashcardsTable)
      .where(eq(flashcardsTable.idCollection, idCollection));

    if (!flashcardList) {
      return res.status(404).send({
        message: `FlashCards from collection ${idCollection} not found.`,
      });
    }

    const [collectionResult] = await db
      .select()
      .from(collectionsTable)
      .where(eq(collectionsTable.idCollection, idCollection));

    if (
      collectionResult === null ||
      collectionResult === undefined ||
      (collectionResult.visibility === "PRIVATE" &&
        userId !== collectionResult.idUser &&
        userRole !== "ADMIN")
    ) {
      return res.status(401).send({
        error: "Unauthorized access.",
      });
    }

    const result = [];
    for (const flashcard of flashcardList) {
      const urlsFlashcard = await db
        .select({
          idUrl: urlsTable.idUrl,
          side: urlsTable.side,
          url: urlsTable.url,
        })
        .from(urlsTable)
        .where(eq(urlsTable.idFlashcard, flashcard.idFlashcard));
      result.push({
        flashcard: flashcard,
        urls: urlsFlashcard,
      });
    }

    return res.status(200).send({
      flashcards: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: "Failed to get flashcards by a collection's id.",
    });
  }
};

/**
 * Récupère les flashcards à réviser pour l'utilisateur dans une collection.
 * Retourne seulement les flashcards dont la date de révision est passée.
 *
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @throws {404} Si aucune flashcard trouvée dans la collection
 * @throws {401} Si la collection est privée et l'utilisateur n'a pas accès
 * @throws {500} Si une erreur serveur se produit
 * @returns {Object}
 *
 */
export const getFlashcardsToReviewByCollectionId = async (req, res) => {
  const { userId, userRole } = req.user;
  const { idCollection } = req.params;

  try {
    const flashcardList = await db
      .select()
      .from(flashcardsTable)
      .where(eq(flashcardsTable.idCollection, idCollection));

    if (!flashcardList) {
      return res.status(404).send({
        message: `FlashCards from collection ${idCollection} not found.`,
      });
    }

    const [collectionResult] = await db
      .select()
      .from(collectionsTable)
      .where(eq(collectionsTable.idCollection, idCollection));

    if (
      collectionResult === null ||
      collectionResult === undefined ||
      (collectionResult.visibility === "PRIVATE" &&
        userId !== collectionResult.idUser &&
        userRole !== "ADMIN")
    ) {
      return res.status(401).send({
        error: "Unauthorized access.",
      });
    }

    const result = [];
    for (const flashcard of flashcardList) {
      const [reviewFlashcard] = await db
        .select()
        .from(reviewsTable)
        .where(
          and(
            eq(reviewsTable.idFlashcard, flashcard.idFlashcard),
            eq(reviewsTable.idUser, userId)
          )
        );

      const dateNow = new Date();

      if (
        reviewFlashcard !== null &&
        reviewFlashcard !== undefined &&
        reviewFlashcard.nextReview <= dateNow
      ) {
        result.push(flashcard);
      }
    }

    return res.status(200).send({
      flashcards: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: "Failed to get flashcards by a collection's id.",
    });
  }
};

/**
 * Modifie une flashcard existante.
 * Valide les permissions d'accès à la collection et met à jour les URLs si fournies.
 *
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @throws {401} Si la collection est privée et l'utilisateur n'a pas accès
 * @throws {404} Si la flashcard n'existe pas
 * @throws {400} Si les URLs sont invalides ou si plus d'une URL par side
 * @throws {500} Si une erreur serveur se produit
 * @returns {Object}
 *
 */
export const patchFlashcardById = async (req, res) => {
  const { userId, userRole } = req.user;
  const { idFlashcard } = req.params;
  const { rectoText = null, versoText = null } = req.body;
  const urls = req.body?.urls ?? null;

  try {
    const [flashcardResult] = await db
      .select()
      .from(flashcardsTable)
      .where(eq(flashcardsTable.idFlashcard, idFlashcard));

    const [collectionResult] = await db
      .select()
      .from(collectionsTable)
      .where(eq(collectionsTable.idCollection, flashcardResult.idCollection));

    if (!collectionResult) {
      return res.status(401).send({
        error: "Flashcard in private collection.",
      });
    }

    if (
      collectionResult?.visibility === "PRIVATE" &&
      userId !== collectionResult.idUser &&
      userRole !== "ADMIN"
    ) {
      return res.status(401).send({
        error: "Unauthorized access.",
      });
    }

    const countSides = { recto: 0, verso: 0 };
    if (urls) {
      for (const urlObject of urls) {
        const { side, url } = urlObject;

        if (side === "RECTO") {
          countSides.recto++;
        }
        if (side === "VERSO") {
          countSides.verso++;
        }

        if (countSides.recto > 1 || countSides.verso > 1) {
          return res.status(400).send({
            error: "Only one url can be changed at once on each side.",
          });
        }

        if (!URL.canParse(url)) {
          return res.status(400).send({
            error: "The text in the url field must be a valid URL.",
          });
        }
      }
    }

    const [result] = await db
      .update(flashcardsTable)
      .set({
        rectoText: rectoText ?? flashcardResult.rectoText,
        versoText: versoText ?? flashcardResult.versoText,
      })
      .where(eq(flashcardsTable.idFlashcard, idFlashcard))
      .returning();

    if (urls) {
      for (const urlObject of urls) {
        const { side, url } = urlObject;

        const [urlFlashcard] = await db
          .select()
          .from(urlsTable)
          .where(
            and(
              eq(urlsTable.idFlashcard, idFlashcard),
              side && eq(urlsTable.side, side)
            )
          );

        if (urlFlashcard) {
          await db
            .update(urlsTable)
            .set({
              url,
            })
            .where(
              and(
                eq(urlsTable.idFlashcard, idFlashcard),
                eq(urlsTable.idUrl, urlFlashcard.idUrl)
              )
            );
        } else {
          await db.insert(urlsTable).values({
            side,
            url,
            idFlashcard: flashcardResult.idFlashcard,
          });
        }
      }
    }

    if (!flashcardResult) {
      return res.status(404).send({
        message: `Flashcard ${idFlashcard} not found.`,
      });
    }

    return res.status(200).send({
      message: `Flashcard ${idFlashcard} updated successfully.`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: "Failed to update flashcard.",
    });
  }
};

/**
 * Supprime une flashcard et toutes ses URLs associées.
 * Supprime aussi les revues associées via contrainte de base de données.
 *
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @throws {404} Si la flashcard n'existe pas
 * @throws {401} Si la collection est privée et l'utilisateur n'a pas accès
 * @throws {500} Si une erreur serveur se produit
 * @returns {Object}
 *
 */
export const deleteFlashcardById = async (req, res) => {
  const { userId, userRole } = req.user;
  const { idFlashcard } = req.params;

  try {
    const [flashcardResult] = await db
      .select()
      .from(flashcardsTable)
      .where(eq(flashcardsTable.idFlashcard, idFlashcard));

    const [collectionResult] = await db
      .select()
      .from(collectionsTable)
      .where(eq(collectionsTable.idCollection, flashcardResult.idCollection));

    if (!flashcardResult || !collectionResult) {
      return res.status(404).send({
        message: `Flashcard ${idFlashcard} not found.`,
      });
    }

    if (
      collectionResult?.visibility === "PRIVATE" &&
      userId !== collectionResult.idUser &&
      userRole !== "ADMIN"
    ) {
      return res.status(401).send({
        error: "Unauthorized access.",
      });
    }

    await db
      .delete(flashcardsTable)
      .where(eq(flashcardsTable.idFlashcard, idFlashcard))
      .returning();

    await db
      .delete(urlsTable)
      .where(eq(urlsTable.idFlashcard, idFlashcard))
      .returning();

    return res.status(200).send({
      message: `Flashcard ${idFlashcard} deleted successfully.`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: "Failed to delete flashcard.",
    });
  }
};

/**
 * Révise une flashcard et met à jour ou crée un enregistrement de révision.
 * Le niveau détermine la date de prochaine révision :
 * - Niveau 1 : +1 jour
 * - Niveau 2 : +2 jours
 * - Niveau 3 : +4 jours
 * - Niveau 4 : +8 jours
 * - Niveau 5 : +16 jours
 *
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @throws {401} Si la collection est privée et l'utilisateur n'a pas accès
 * @throws {500} Si une erreur serveur se produit
 * @returns {Object}
 *
 */
export const reviewFlashcard = async (req, res) => {
  const { userId, userRole } = req.user;
  const { idFlashcard } = req.params;
  const { level } = req.body;

  try {
    const [flashcardResult] = await db
      .select()
      .from(flashcardsTable)
      .where(eq(flashcardsTable.idFlashcard, idFlashcard));

    const [collectionResult] = await db
      .select()
      .from(collectionsTable)
      .where(eq(collectionsTable.idCollection, flashcardResult.idCollection));

    if (
      !collectionResult ||
      (collectionResult.visibility === "PRIVATE" &&
        userId !== collectionResult.idUser &&
        userRole !== "ADMIN")
    ) {
      return res.status(401).send({
        error: "Unauthorized access.",
      });
    }

    const [reviewFlashcardResult] = await db
      .select()
      .from(reviewsTable)
      .where(
        and(
          eq(reviewsTable.idFlashcard, idFlashcard),
          eq(reviewsTable.idUser, userId)
        )
      );

    const lastReview = new Date();
    const nextReview = new Date();
    switch (level) {
      case "1":
        nextReview.setDate(nextReview.getDate() + 1);
        break;
      case "2":
        nextReview.setDate(nextReview.getDate() + 2);
        break;
      case "3":
        nextReview.setDate(nextReview.getDate() + 4);
        break;
      case "4":
        nextReview.setDate(nextReview.getDate() + 8);
        break;
      case "5":
        nextReview.setDate(nextReview.getDate() + 16);
        break;
    }

    if (reviewFlashcardResult) {
      const review = await db
        .update(reviewsTable)
        .set({
          currentLevel: level,
          lastReview,
          nextReview,
        })
        .where(eq(reviewsTable.idReview, reviewFlashcardResult.idReview))
        .returning();

      return res.status(200).send({
        message: "Flashcard review updated.",
        review: review,
      });
    } else {
      const review = await db
        .insert(reviewsTable)
        .values({
          idUser: userId,
          idFlashcard,
          currentLevel: level,
          lastReview,
          nextReview,
        })
        .returning();

      return res.status(201).send({
        message: "Flashcard reviewed successfully.",
        review: review,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: "Failed to insert Flashcard",
    });
  }
};
