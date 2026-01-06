import { db } from "../db/database.js";
import {
  collectionsTable,
  flashcardsTable,
  urlsTable,
  lower,
  reviewsTable,
} from "../db/schema.js";
import { eq, and, inArray } from "drizzle-orm";

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
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
    for (let i = 0; i < urls?.length; i++) {
      const { side, url } = urls[i];
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

    return res.status(201).send({
      message: "Flashcard created succesfully.",
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
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
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
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
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
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
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
