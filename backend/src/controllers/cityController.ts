// controllers/cityController.ts
import { Request, Response } from "express";
import City from "../models/city";

/**
 * @swagger
 * /api/cities:
 *   post:
 *     summary: Ajouter une ville manuellement
 *     tags: [Villes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               pays:
 *                 type: string
 *             required:
 *               - nom
 *               - pays
 *     responses:
 *       201:
 *         description: Ville créée
 *       500:
 *         description: Erreur serveur
 */

export const createCity = async (req: Request, res: Response) => {
  try {
    const city = await City.create(req.body);
    res.status(201).json(city);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de la ville", details: error });
  }
};
/**
 * @swagger
 * /api/cities/bulk:
 *   post:
 *     summary: Ajouter plusieurs villes en une seule requête
 *     tags: [Villes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 cityid:
 *                   type: integer
 *                   example: 142
 *                 countryid:
 *                   type: integer
 *                   example: 123
 *                 cityname:
 *                   type: string
 *                   example: Nabeul
 *                 citycode:
 *                   type: integer
 *                   example: 129444
 *                 countryname:
 *                   type: string
 *                   example: Tunisia
 *                 cityiddotcom:
 *                   type: integer
 *                   example: 0
 *     responses:
 *       201:
 *         description: Villes ajoutées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 2 villes ajoutées
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       cityid:
 *                         type: integer
 *                       cityname:
 *                         type: string
 *       500:
 *         description: Erreur serveur lors de l'ajout
 */

export const createManyCities = async (req: Request, res: Response) => {
  try {
    const cities = req.body; // tableau
    const result = await City.bulkCreate(cities);
    res.status(201).json({ message: `${result.length} villes ajoutées`, data: result });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'insertion multiple", details: error });
  }
};
/**
 * @swagger
 * /api/cities:
 *   get:
 *     summary: Récupérer la liste de toutes les villes
 *     tags: [Villes]
 *     responses:
 *       200:
 *         description: Liste des villes récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   cityid:
 *                     type: integer
 *                     example: 141
 *                   countryid:
 *                     type: integer
 *                     example: 123
 *                   cityname:
 *                     type: string
 *                     example: Djerba
 *                   citycode:
 *                     type: integer
 *                     example: 100141
 *                   countryname:
 *                     type: string
 *                     example: Tunisia
 *                   cityiddotcom:
 *                     type: integer
 *                     example: 0
 *       500:
 *         description: Erreur serveur lors de la récupération des villes
 */

export const getAllCities = async (_req: Request, res: Response) => {
  try {
    const cities = await City.findAll();
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des villes", details: error });
  }
};
/**
 * @swagger
 * /api/cities/count:
 *   get:
 *     summary: Compter le nombre total de villes
 *     tags: [Villes]
 *     responses:
 *       200:
 *         description: Nombre total de villes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 13
 *       500:
 *         description: Erreur lors du comptage des villes
 */
export const getCityCount = async (_req: Request, res: Response) => {
  try {
    const count = await City.count();
    res.status(200).json({ total: count });
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors du comptage des villes",
      details: error,
    });
  }
};
