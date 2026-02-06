import "reflect-metadata";
import { config } from "dotenv";
import database from "./config/database";
import { Application, json, Request, Response } from "express";
import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerOptions from "./swagger";
import cors from "cors";
import morganBody from "morgan-body";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
import errorHandler from "./middlewares/errorHandler";
import router from "./router";
import cookieparser from "cookie-parser";

config();
database();

const app: Application = express();
const PORT = process.env.PORT || 8090;
const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use(
  cors({
    credentials: true,
    // origin: ""
  })
);
app.use(cookieparser());
app.use(json());

morganBody(app, {
  logResponseBody: true,
  immediateReqLog: true,
  logAllReqHeader: false,
  timezone: "Africa/Lagos",
  prettify: true,
  logRequestBody: true,
  logReqUserAgent: false,
});

app.use(morgan("dev"));
app.use(helmet());

app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/health-check", (req: Request, res: Response) => {
  res.status(200).json({ status: true, message: "Welcome to Event Drop" });
});

app.use("/v1", router);
app.use(errorHandler);
app.all("/{*any}", (req: Request, res: Response) => {
  res.status(404).json({
    message: "Requested route does not exist",
    data: null,
  });
});

app.listen(PORT, () => console.log(`Server listening at port: ${PORT}`));
