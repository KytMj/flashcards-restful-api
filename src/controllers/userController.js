import { db } from "../db/database.js";
import { usersTable, collectionsTable, reviewsTable } from "../db/schema.js";
import { desc, eq } from "drizzle-orm";

/**
 * Récupère la liste de tous les utilisateurs.
 * Retourne les informations de tous les utilisateurs, triés par date de création (plus récent en premier).
 * Exclut le champ `password` pour des raisons de sécurité.
 *
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @throws {500} Si une erreur serveur se produit
 * @returns {Object}
 *
 */
export const getUsers = async (req, res) => {
  try {
    const usersResult = await db
      .select({
        idUser: usersTable.idUser,
        email: usersTable.email,
        firstname: usersTable.firstname,
        lastname: usersTable.lastname,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
        role: usersTable.role,
      })
      .from(usersTable)
      .orderBy(desc(usersTable.createdAt));

    return res.status(200).send({
      users: usersResult,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: "Failed to get users",
    });
  }
};

/**
 * Récupère les informations détaillées d'un utilisateur.
 * Retourne l'utilisateur, ses collections et ses revues (révisions de flashcards).
 * Exclut le champ `password` pour des raisons de sécurité.
 *
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @throws {404} Si l'utilisateur n'existe pas
 * @throws {500} Si une erreur serveur se produit
 * @returns {Object}
 *
 */
export const getUserById = async (req, res) => {
  const { idUser } = req.params;
  try {
    const [userResult] = await db
      .select({
        idUser: usersTable.idUser,
        email: usersTable.email,
        firstname: usersTable.firstname,
        lastname: usersTable.lastname,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
        role: usersTable.role,
      })
      .from(usersTable)
      .where(eq(usersTable.idUser, idUser));

    const collectionsResult = await db
      .select()
      .from(collectionsTable)
      .where(eq(collectionsTable.idUser, idUser));

    const reviewsResult = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.idUser, idUser));

    if (!userResult) {
      return res.status(404).send({
        message: `User ${idUser} not found.`,
      });
    }

    return res.status(200).send({
      user: userResult,
      collections: collectionsResult,
      reviewsResult: reviewsResult,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: "Failed to get user by id",
    });
  }
};

/**
 * Supprime un utilisateur par son identifiant.
 * Supprime en cascade ses collections, flashcards, URLs et revues.
 * Un utilisateur ne peut pas supprimer son propre compte (même en étant un administrateur).
 *
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @throws {401} Si l'utilisateur tente de supprimer son propre compte
 * @throws {404} Si l'utilisateur à supprimer n'existe pas
 * @throws {500} Si une erreur serveur se produit
 * @returns {Object}
 *
 */
export const deleteUserById = async (req, res) => {
  const { userId } = req.user;
  const { idUser } = req.params;

  try {
    if (userId === idUser) {
      return res.status(401).send({
        error: "Unauthorized account deletion.",
      });
    }

    const [result] = await db
      .delete(usersTable)
      .where(eq(usersTable.idUser, idUser))
      .returning();

    if (!result) {
      return res.status(404).send({
        message: `User ${idUser} not found.`,
      });
    }

    return res.status(200).send({
      message: `User ${idUser} deleted successfully.`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: "Failed to delete user by id.",
    });
  }
};
