import { db } from "../db/database.js";
import { collectionsTable, usersTable } from "../db/schema.js";
import { eq, and } from "drizzle-orm";

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
export const getUserCollections = async (req, res) => {
  const { userId } = req.user;
  try {
    const result = await db
      .select()
      .from(collectionsTable)
      .where(eq(userId, collectionsTable.idUser));
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send({
      error: "Failed to fetch user's collections.",
    });
  }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
export const getCollection = async (req, res) => {
  const { idCollection } = req.params;
  try {
    const [result] = await db
      .select()
      .from(collectionsTable)
      .where(eq(collectionsTable.idCollection, idCollection))
      .orderBy("createdAt", "desc");
    if (!result) {
      return res.status(404).send({
        message: `Question ${idCollection} not found.`,
      });
    }
    // TODO : vérifier si privé, le propriétaire
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send({
      error: "Failed to fetch question",
    });
  }
};
