import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRouter from "./router/auth.js";
import boardRouter from "./router/board/index.js";
import sequelize from "./models/index.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/board", boardRouter);

// throw Error
app.use((err, req, res, next) => {
  if (err) {
    const { status, errors } = err;
    return res.status(status).json({ errors });
  }

  return res.status(500).json({ errors: { msg: "관리자 문의" } });
});

sequelize.sync({ cors: { origin: "*" } }).then((client) => {
  app.listen(8080);
});
