import "dotenv/config";
import jwt from "jsonwebtoken";

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {any} next
 * @returns
 */
export const checkToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(403).send({
        message: "Access token required.",
      });
    }

    const decodedToken = jwt.verify(token.substr(7), process.env.JWT_SECRET);

    if (decodedToken) {
      const userId = decodedToken.userId;
      req.user = { userId };
      next();
    }
  } catch (err) {
    return res.status(401).send({
      message: "Invalid/Expired access token.",
    });
  }
};
