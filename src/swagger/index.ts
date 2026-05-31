import { Options } from "swagger-jsdoc";
import { config } from "dotenv";
import { paths } from "./config";

config();

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "EventDrop API",
    version: "1.0.0",
    description:
      "A backend API for creating and managing event-based photo galleries. Event owners can create events, generate unique upload links, and allow guests to upload photos without authentication. Supports real-time updates using Socket.IO, photo moderation, likes/comments, and optional premium features.",
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
