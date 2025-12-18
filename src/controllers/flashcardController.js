import { db } from "../db/database.js";
import {
  collectionsTable,
  flashcardsTable,
  urlsTable,
  lower,
} from "../db/schema.js";
import { eq, and, like } from "drizzle-orm";

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
