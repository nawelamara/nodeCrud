import express from "express";
import { createCity, createManyCities,getAllCities,getCityCount } from "../controllers/cityController";

const router = express.Router();

router.post("/", createCity); // pour ajouter une ville unique
router.post("/bulk", createManyCities); // pour ajouter plusieurs villes
router.get("/", getAllCities);            // Afficher toutes les villes
router.get("/count", getCityCount);
export default router;
