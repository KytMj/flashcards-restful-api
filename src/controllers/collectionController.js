import { db } from "../db/database.js";
import { collectionsTable, lower } from "../db/schema.js";
import { eq, and, like } from "drizzle-orm";

/**
 * Récupère toutes les collections de l'utilisateur connecté.
 * Retourne les informations de toutes ses collections.
 *
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @throws {500} Si une erreur serveur se produit
 * @returns {Object}
 *
 */
export const getUserCollections = async (req, res) => {
  const { userId } = req.user;
  try {
    const result = await db
      .select()
      .from(collectionsTable)
      .where(eq(userId, collectionsTable.idUser));
    return res.status(200).send({
      collections: result,
    });
  } catch (err) {
    return res.status(500).send({
      error: "Failed to fetch user's collections.",
    });
  }
};

/**
 * Récupère une collection par son identifiant.
 * Vérifie les permissions d'accès (privée/publique).
 *
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @throws {404} Si la collection n'existe pas
 * @throws {401} Si la collection est privée et l'utilisateur n'est pas propriétaire/admin
 * @throws {500} Si une erreur serveur se produit
 * @returns {Object} Objet contenant les informations de la collection
 *
 */
export const getCollectionById = async (req, res) => {
  const { userId, userRole } = req.user;
  const { idCollection } = req.params;

  try {
    const [result] = await db
      .select()
      .from(collectionsTable)
      .where(eq(collectionsTable.idCollection, idCollection))
      .orderBy("createdAt", "desc");
    if (!result) {
      return res.status(404).send({
        message: `Collection ${idCollection} not found.`,
      });
    }

    if (
      result.visibility === "PRIVATE" &&
      userId !== result.idUser &&
      userRole !== "ADMIN"
    ) {
      return res.status(401).send({
        error: "Unauthorized",
      });
    }

    return res.status(200).send({
      collection: result,
    });
  } catch (err) {
    return res.status(500).send({
      error: "Failed to fetch collection",
    });
  }
};

/**
 * Recherche les collections publiques par titre.
 * Retourne les collections dont le titre contient les caractères donnés.
 *
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @throws {404} Si aucune collection n'est trouvée
 * @throws {500} Si une erreur serveur se produit
 * @returns {Object}
 *
 */
export const searchPublicCollections = async (req, res) => {
  const { title } = req.query;

  try {
    const result = await db
      .select()
      .from(collectionsTable)
      .where(
        and(
          title
            ? like(lower(collectionsTable.title), `%${title.toLowerCase()}%`)
            : undefined,
          eq(collectionsTable.visibility, "PUBLIC")
        )
      )
      .orderBy("title", "asc");

    if (!result) {
      return res.status(404).send({
        message: `No collections found.`,
      });
    }

    return res.status(200).send({
      collections: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: "Failed to fetch collection",
    });
  }
};

/**
 * Crée une nouvelle collection pour l'utilisateur connecté.
 * Retourne les informations de la collection créée.
 *
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @throws {500} Si une erreur serveur se produit
 * @returns {Object}
 *
 */
export const postUserCollection = async (req, res) => {
  const { userId } = req.user;
  const { title, description = null, visibility } = req.body;

  try {
    const result = await db
      .insert(collectionsTable)
      .values({
        title,
        description,
        visibility,
        idUser: userId,
      })
      .returning();
    return res.status(201).send({
      message: "Collection created successfully.",
      collection: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: "Failed to insert collection",
    });
  }
};

/**
 * Modifie une collection existante.
 * Seul le propriétaire de la collection ou un administrateur peut la modifier.
 *
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @throws {403} Si l'utilisateur n'est pas propriétaire et n'est pas admin
 * @throws {404} Si la collection n'existe pas
 * @throws {500} Si une erreur serveur se produit
 * @returns {Object}
 *
 */
export const patchCollection = async (req, res) => {
  const { userId, userRole } = req.user;
  const { idCollection } = req.params;
  const { title = null, description = null, visibility = null } = req.body;

  try {
    const [collectionResult] = await db
      .select()
      .from(collectionsTable)
      .where(
        and(
          eq(collectionsTable.idCollection, idCollection),
          eq(collectionsTable.idUser, userId)
        )
      );

    if (!collectionResult && userRole !== "ADMIN") {
      return res.status(403).send({
        message: `Unauthorized to update this collection.`,
      });
    }

    const [result] = await db
      .update(collectionsTable)
      .set({
        title: title ?? collectionResult.title,
        description: description ?? collectionResult.description,
        visibility: visibility ?? collectionResult.visibility,
        updatedAt: new Date(),
      })
      .where(eq(collectionsTable.idCollection, idCollection))
      .returning();

    if (!result) {
      return res.status(404).send({
        message: `Collection ${idCollection} not found.`,
      });
    }

    return res.status(200).send({
      message: `Collection ${idCollection} updated successfully.`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: "Failed to update collection.",
    });
  }
};

/**
 * Supprime une collection existante.
 * Supprime aussi en cascade toutes les flashcards, URLs et revues associées.
 * Seul le propriétaire de la collection ou un administrateur peut la supprimer.
 *
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @throws {403} Si l'utilisateur n'est pas propriétaire et n'est pas admin
 * @throws {404} Si la collection n'existe pas
 * @throws {500} Si une erreur serveur se produit
 * @returns {Object}
 *
 */
export const deleteCollection = async (req, res) => {
  const { userId, userRole } = req.user;
  const { idCollection } = req.params;

  try {
    const [collectionResult] = await db
      .select()
      .from(collectionsTable)
      .where(
        and(
          eq(collectionsTable.idCollection, idCollection),
          eq(collectionsTable.idUser, userId)
        )
      );

    if (!collectionResult && userRole !== "ADMIN") {
      return res.status(403).send({
        message: `Unauthorized to delete this collection.`,
      });
    }

    const [result] = await db
      .delete(collectionsTable)
      .where(eq(collectionsTable.idCollection, idCollection))
      .returning();

    if (!result) {
      return res.status(404).send({
        message: `Collection ${idCollection} not found.`,
      });
    }

    return res.status(200).send({
      message: `Collection ${idCollection} deleted successfully.`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: "Failed to delete collection.",
    });
  }
};
