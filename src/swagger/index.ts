import { Options } from "swagger-jsdoc";
import { config } from "dotenv";
import { paths } from "./config";

config();

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "MedyKare API",
    version: "1.0.0",
    description:
      "MedyKare is an Health Application connecting patients with doctors, laboratories and pharmacies.",
  },
  servers: [
    {
      url: process.env.PRODUCTION_URL || "http://localhost:8090/v1",
    },
  ],
  tags: [],
  paths,
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const swaggerOptions: Options = {
  definition: swaggerDefinition,
  apis: [],
};

export default swaggerOptions;
