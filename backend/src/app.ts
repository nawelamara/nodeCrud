import express from 'express';
import sequelize from './config/database';
import userRoutes from './routes/userRoutes';
import userJsonRoutes from './routes/userJsonRoutes';
import experienceJsonRoutes from './routes/experienceJsonRoutes';
import bookingJsonRoutes from './routes/bookingJsonRoutes';
import cityRoutes from "./routes/cityRoutes";

const app = express();
const PORT = 4000;

app.use(express.json());
app.use('/users', userRoutes);
app.use('/usersjson', userJsonRoutes);
app.use("/experiences", experienceJsonRoutes);
app.use("/bookings", bookingJsonRoutes);
app.use("/cities", cityRoutes);

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://192.99.232.126:${PORT}`);
  });
});
// src/app.ts
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";

app.use(express.json());

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mes routes
import experienceRoutes from "./routes/experienceJsonRoutes";
app.use("/api/experiences", experienceRoutes);
app.use("/api/cities", cityRoutes);

// Lancement
app.listen(3000, () => {
  console.log('Serveur lancé sur http://192.99.232.126:44201/');
  console.log('Swagger dispo sur http://192.99.232.126:44201/api-docs');
});

export default app;
