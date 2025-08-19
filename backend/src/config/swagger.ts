// src/config/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API d'Expériences Touristiques",
    version: "1.0.0",
    description: "Documentation de l'API Experience avec Node.js + PostgreSQL (JSONB)",
  },
  servers: [
    {
      url: "http://192.99.232.126:44201", // ou ton URL déployée
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // Où Swagger lit les annotations
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
