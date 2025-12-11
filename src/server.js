// RESTful API avec Express
import express from "express";
import authRouter from "./router/authRouter.js";
import logger from "./middleware/logger.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(logger);

app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
