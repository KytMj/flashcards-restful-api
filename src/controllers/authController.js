import "dotenv/config";
import { db } from "../db/database.js";
import { usersTable } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Crée un nouvel utilisateur et retourne un token JWT valable 24 heures.
 *
 * @param {Request} req
 * @param {Response} res
 * @throws {401} Si un utilisateur avec cet email existe déjà
 * @throws {500} Si une erreur serveur se produit
 * @returns {Object}
 *
 */
export const register = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const salt = await bcrypt.genSalt(12);

    const hashPassword = await bcrypt.hash(password, salt);

    const [result] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (result) {
      return res.status(401).send({
        message: `User with email ${email} already exists.`,
      });
    }

    const userData = await db
      .insert(usersTable)
      .values({ email, firstname, lastname, password: hashPassword })
      .returning({
        idUser: usersTable.idUser,
        role: usersTable.role,
        email: usersTable.email,
        firstname: usersTable.firstname,
        lastname: usersTable.lastname,
      });

    const token = jwt.sign(
      {
        userId: userData.idUser,
        userRole: userData.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(201).send({
      message: "User created.",
      user: userData,
      token: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: "Failed to register user.",
    });
  }
};

/**
 * Authentifie un utilisateur avec ses identifiants (email et mot de passe).
 * Retourne les informations de l'utilisateur et un token JWT valable 24 heures.
 *
 * @param {Request} req
 * @param {Response} res
 * @throws {401} Si l'email ou le mot de passe est incorrect
 * @throws {500} Si une erreur serveur se produit
 * @returns {Object}
 *
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [userResult] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!userResult) {
      return res.status(401).send({
        message: `User with wrong email or password.`,
      });
    }

    const comparePassword = await bcrypt.compare(password, userResult.password);

    if (!comparePassword) {
      return res.status(401).send({
        message: `User with wrong email or password.`,
      });
    }

    const token = jwt.sign(
      {
        userId: userResult.idUser,
        userRole: userResult.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).send({
      message: "User logged.",
      user: {
        idUser: userResult.idUser,
        email: userResult.email,
        firstname: userResult.firstname,
        lastname: userResult.lastname,
      },
      token: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: "Failed to login user.",
    });
  }
};
