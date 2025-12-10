import "dotenv/config";
import { db } from "../db/database.js";
import { usersTable } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(12);

    const hashPassword = await bcrypt.hash(password, salt);
    console.log(hashPassword);

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
      .values({ email, username, password: hashPassword })
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        username: usersTable.username,
      });

    const token = jwt.sign(
      {
        userId: userData.id,
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
 *
 * @param {Request} req
 * @param {Response} res
 * @returns
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
        userId: userResult.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(201).send({
      message: "User logged.",
      user: {
        id: userResult.id,
        email: userResult.email,
        username: userResult.username,
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
