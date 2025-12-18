import { ZodError, ZodType } from "zod";

export const validateBody = (schema) => {
  return (req, res, next) => {
    if (schema instanceof ZodType) {
      try {
        req.body = schema.parse(req.body); // Zod peut modifier les données incorrectes (ex. int transformé en string). On modifie le req.body pour que le prochain middleware utilise les bonnes données
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).send({
            error: "Validation failed",
            details: error.issues,
          });
        }
        return res.status(500).send({
          error: "Internal server error",
        });
      }
    }
  };
};

export const validateParams = (schema) => {
  return (req, res, next) => {
    if (schema instanceof ZodType) {
      try {
        schema.parse(req.params);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).send({
            error: "Invalid params",
            details: error.issues,
          });
        }
        console.log(error);
        return res.status(500).send({
          error: "Internal server error",
        });
      }
    }
  };
};

export const validateQuery = (schema) => {
  return (req, res, next) => {
    if (schema instanceof ZodType) {
      try {
        schema.parse(req.query);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).send({
            error: "Invalid query",
            details: error.issues,
          });
        }
        console.log(error);
        return res.status(500).send({
          error: "Internal server error",
        });
      }
    }
  };
};
