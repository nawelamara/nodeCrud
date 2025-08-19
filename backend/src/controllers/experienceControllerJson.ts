import { Request, RequestHandler, Response, NextFunction } from "express";
import ExperienceJson from "../models/experienceJson";
import { Op, Sequelize, QueryTypes } from "sequelize";
import { isValid, parseISO } from "date-fns";
import sequelize from "../config/database";
import Favorite from '../models/favorite';
import Bundle from '../models/bundle';

/**
 * @swagger
 * /api/experiences:
 *   post:
 *     summary: Créer une nouvelle expérience
 *     description: Crée une nouvelle expérience touristique à partir des données JSON fournies.
 *     tags:
 *       - Expériences
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Croisière au coucher du soleil
 *               price:
 *                 type: number
 *                 example: 120
 *               category:
 *                 type: string
 *                 example: Tout public
 *               averageRating:
 *                 type: number
 *                 example: 4.8
 *               language:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Français", "Anglais"]
 *             required:
 *               - title
 *               - price
 *     responses:
 *       201:
 *         description: Expérience créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 data:
 *                   type: object
 *       500:
 *         description: Erreur lors de la création de l'expérience
 */
export const createExperience = async (req: Request, res: Response): Promise<void> => {
  try {
    const newExperience = await ExperienceJson.create({ data: req.body });
    res.status(201).json(newExperience);
  } catch (error) {
    res.status(500).json({ error: "Erreur création expérience", details: error });
  }
};

/**
 * @swagger
 * /api/experiences:
 *   get:
 *     summary: Récupérer toutes les expériences
 *     tags: [Expériences]
 *     responses:
 *       200:
 *         description: Liste des expériences
 */
export const getAllExperiences = async (_req: Request, res: Response): Promise<void> => {
  try {
    console.log("Requête reçue !");
    const experiences = await ExperienceJson.findAll({});
    console.log("Expériences récupérées :", experiences.length);
    res.status(200).json(experiences);
  } catch (error) {
    console.error("Erreur dans getAllExperiences :", error);
    res.status(500).json({ error: "Erreur récupération expériences", details: error });
  }
};

/**
 * @swagger
 * /api/experiences/{id}:
 *   get:
 *     summary: Récupérer une expérience par ID
 *     tags: [Expériences]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expérience trouvée
 *       404:
 *         description: Expérience non trouvée
 */
export const getExperienceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const experience = await ExperienceJson.findByPk(req.params.id);
    if (!experience) {
      res.status(404).json({ message: "Expérience introuvable" });
      return;
    }
    res.status(200).json(experience);
  } catch (error) {
    res.status(500).json({ error: "Erreur récupération", details: error });
  }
};

/**
 * @swagger
 * /api/experiences/{id}:
 *   put:
 *     summary: Mettre à jour une expérience
 *     tags: [Expériences]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               title: "Balade modifiée"
 *               price: 149.99
 *     responses:
 *       200:
 *         description: Expérience mise à jour
 *       404:
 *         description: Expérience introuvable
 */
export const updateExperience = async (req: Request, res: Response): Promise<void> => {
  try {
    const experience = await ExperienceJson.findByPk(req.params.id);
    if (!experience) {
      res.status(404).json({ message: "Expérience introuvable" });
      return;
    }
    await experience.update({ data: req.body });
    res.status(200).json(experience);
  } catch (error) {
    res.status(500).json({ error: "Erreur modification", details: error });
  }
};

/**
 * @swagger
 * /api/experiences/{id}:
 *   delete:
 *     summary: Supprimer une expérience par ID
 *     tags: [Expériences]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Expérience supprimée
 *       404:
 *         description: Expérience non trouvée
 */
export const deleteExperience = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10); // ✅ Ensure ID is an integer

    if (isNaN(id)) {
      res.status(400).json({ message: "ID invalide" });
      return;
    }

    const experience = await ExperienceJson.findByPk(id);

    if (!experience) {
      res.status(404).json({ message: "Expérience introuvable" });
      return;
    }

    await experience.destroy();
    res.status(200).json({ message: "Expérience supprimée avec succès" }); // ✅ Success message
  } catch (error) {
    res.status(500).json({ error: "Erreur suppression", details: error });
  }
};


/**
 * @swagger
 * /api/experiences:
 *   delete:
 *     summary: Supprimer toutes les expériences
 *     tags: [Expériences]
 *     responses:
 *       200:
 *         description: Toutes les expériences supprimées
 */
export const deleteAllExperiences = async (req: Request, res: Response) => {
  try {
    await sequelize.query(`DELETE FROM "experienceJsons";`);
    res.status(200).json({ message: "Toutes les expériences ont été supprimées avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ error: "Erreur lors de la suppression de toutes les expériences." });
  }
};

/**
 * @swagger
 * /api/experiences/search:
 *   post:
 *     summary: Search experiences with dynamic filters
 *     description: |
 *       Search for experiences using dynamic filters (partial match and case-insensitive for strings).
 *       At least one filter is required. Fields stored in JSONB can be deeply filtered.
 *     tags: [Expériences]
 *     requestBody:
 *      required: true
 *      content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string, example: "atelier" }
 *               price: { type: number, example: 100 }
 *               city: { type: string, example: "djerba" }
 *               country: { type: string, example: "tunisia" }
 *               tags: { type: string, example: "cuisine,tradition" }
 *               category: { type: string, example: "apprentissage" }
 *               duration: { type: string, example: "4 hours" }
 *               language: { type: string, example: "French" }
 *               start: { type: string, format: date, example: "2025-07-20" }
 *               end: { type: string, format: date, example: "2025-12-31" }
 *               accessibility: { type: string, example: "reduced mobility" }
 *               freeCancellation: { type: boolean, example: true }
 *               minRemainingSpots: { type: integer, example: 5 }
 *               availableDays: { type: string, example: "Tuesday,Friday" }
 *               provider: { type: string, example: "Saveurs de Djerba" }
 *               averageRating: { type: number, example: 4.5 }
 *               startTime: { type: string, example: "10:00" }
 *               experienceType: { type: string, example: "culinary" }
 *               minAge: { type: integer, example: 18 }
 *               maxAge: { type: integer, example: 60 }
 *               popularity: { type: boolean, example: true }
 *               activityLevel: { type: string, example: "moderate" }
 *               groupType: { type: string, example: "family" }
 *               sortBy:
 *                 type: string
 *                 enum: [price, averageRating, createdAt]
 *                 example: "price"
 *               sortOrder:
 *                 type: string
 *                 enum: [asc, desc]
 *                 example: "asc"
 *             example:
 *               title: "atelier"
 *               price: 100
 *               city: "djerba"
 *               country: "tunisia"
 *               tags: "cuisine,tradition"
 *               category: "apprentissage"
 *               duration: "4 hours"
 *               language: "French"
 *               start: "2025-07-20"
 *               end: "2025-12-31"
 *               accessibility: "reduced mobility"
 *               freeCancellation: true
 *               minRemainingSpots: 5
 *               availableDays: "Tuesday,Friday"
 *               provider: "Saveurs de Djerba"
 *               averageRating: 4.5
 *               startTime: "10:00"
 *               experienceType: "culinary"
 *               minAge: 18
 *               maxAge: 60
 *               popularity: true
 *               activityLevel: "moderate"
 *               groupType: "family"
 *               sortBy: "price"
 *               sortOrder: "asc"
 *     responses:
 *       200:
 *         description: Filtered experiences list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 27
 *                   data:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "Atelier de cuisine tunisienne à Djerba"
 *                       price:
 *                         type: number
 *                         example: 50
 *                       location:
 *                         type: object
 *                         properties:
 *                           city:
 *                             type: string
 *                             example: "Djerba"
 *                           country:
 *                             type: string
 *                             example: "Tunisia"
 *                           address:
 *                             type: string
 *                             example: "Maison des Saveurs, Houmt Souk"
 *                       experienceCategory:
 *                         type: string
 *                         example: "culinary"
 *                       duration:
 *                         type: string
 *                         example: "4 hours"
 *                       availableLanguages:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["French", "German"]
 *                       availability:
 *                         type: object
 *                         properties:
 *                           start:
 *                             type: string
 *                             format: date
 *                             example: "2025-07-20"
 *                           end:
 *                             type: string
 *                             format: date
 *                             example: "2025-12-31"
 *                       freeCancellation:
 *                         type: boolean
 *                         example: true
 *                       remainingSeats:
 *                         type: integer
 *                         example: 10
 *                       availableDays:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Tuesday", "Friday"]
 *                       supplierContact:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Saveurs de Djerba"
 *                       averageRating:
 *                         type: number
 *                         example: 4.7
 *                       meetingTime:
 *                         type: string
 *                         example: "10:00"
 *                       minAge:
 *                         type: integer
 *                         example: 16
 *                       maxAge:
 *                         type: integer
 *                         example: 60
 *                       activityLevel:
 *                         type: string
 *                         example: "moderate"
 *                       groupType:
 *                         type: string
 *                         example: "family"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-07-14T11:12:58.162Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-07-14T11:12:58.162Z"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de la recherche"
 *                 details:
 *                   type: string
 *                   example: "TypeError: Cannot read property 'split' of undefined"
 */

export const searchExperiences = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      price,
      city,
      country,
      tags,
      category,
      duration,
      language,
      start,
      end,
      accessibility,
      freeCancellation,
      RemainingSeats,
      availableDays,
      supplier,
      averageRating,
      startTime,
      experienceType,
      GroupMin,
      GroupMax,
      popularity,
      description,
      groupType,
      sortBy,
      sortOrder
    } = req.body;

    const whereClauses: any[] = [];

if (title) {
  const safeTitle = title.replace(/'/g, "''"); // échappe les apostrophes
  whereClauses.push(
    Sequelize.literal(`(
      LOWER(data->>'title') LIKE LOWER('%${safeTitle}%') OR
      LOWER(data->>'Title') LIKE LOWER('%${safeTitle}%')
    )`)
  );
}


if (city) {
  const safeCity = city.replace(/'/g, "''");
  whereClauses.push(
    Sequelize.literal(`(
      LOWER(data->'location'->>'city') LIKE LOWER('%${safeCity}%') OR
      LOWER(data->>'city') LIKE LOWER('%${safeCity}%') OR
      LOWER(data->'Location'->>'city') LIKE LOWER('%${safeCity}%')
    )`)
  );
}



    if (country) {
      whereClauses.push({
     [Op.or]: [
      Sequelize.where(Sequelize.json('data.location.country') as any, { [Op.iLike]: `%${country}%` }),
      Sequelize.where(Sequelize.json('data.country') as any, { [Op.iLike]: `%${country}%` }),
      Sequelize.where(Sequelize.json('data.Location.country') as any, { [Op.iLike]: `%${country}%` })
    ]
  });
}
if (price) {
  whereClauses.push(
    Sequelize.literal(`
      (
        (data->>'Price')::float <= ${parseFloat(price)} OR
        EXISTS (
          SELECT 1
          FROM jsonb_array_elements(data->'Pricing') AS p
          WHERE (p->>'price')::float <= ${parseFloat(price)}
        )
      )
    `)
  );
}
if (tags) {
  const tagList = tags.split(",").map((tag: string) => tag.trim());
  for (const tag of tagList) {
    const jsonArray = JSON.stringify([tag]); // transforme "culture" en '["culture"]'
    whereClauses.push({
      [Op.or]: [
        Sequelize.literal(`data->'Tags' @> '${jsonArray}'`),
        Sequelize.literal(`data->'tags' @> '${jsonArray}'`)
      ]
    });
  }
}
if (category) {
  whereClauses.push({
    [Op.or]: [
      Sequelize.where(Sequelize.json('data.experienceCategory') as any, { [Op.iLike]: `%${category}%` }),
      Sequelize.where(Sequelize.json('data.ExperienceCategory') as any, { [Op.iLike]: `%${category}%` })
    ]
  });
}
if (description) {
  const safeDesc = description.replace(/'/g, "''");
  whereClauses.push(
    Sequelize.literal(`(
      LOWER(data->>'description') LIKE LOWER('%${safeDesc}%') OR
      LOWER(data->>'Description') LIKE LOWER('%${safeDesc}%')
    )`)
  );
}


    if (duration) {
      whereClauses.push(
        Sequelize.where(Sequelize.json('data.duration') as any, { [Op.iLike]: `%${duration}%` })
      );
    }

if (language) {
  const safeLang = language.toLowerCase().replace(/'/g, "''");
  whereClauses.push(Sequelize.literal(`(
    EXISTS (
      SELECT 1 FROM jsonb_array_elements_text("data"->'AvailableLanguages') AS l
      WHERE LOWER(l) = '${safeLang}'
    )
    OR
    EXISTS (
      SELECT 1 FROM jsonb_array_elements_text("data"->'languages') AS l
      WHERE LOWER(l) = '${safeLang}'
    )
  )`));
}


if (start) {
  whereClauses.push(
    Sequelize.literal(`(
      (data->'availability'->>'start')::date <= '${start}' OR
      (data->'Availability'->>'start')::date <= '${start}'
    )`)
  );
}

if (end) {
  whereClauses.push(
    Sequelize.literal(`(
      (data->'availability'->>'end')::date >= '${end}' OR
      (data->'Availability'->>'end')::date >= '${end}'
    )`)
  );
}

    if (accessibility) {
      whereClauses.push(Sequelize.literal(`"data"->'accessibility' ? '${accessibility}'`));
    }

if (freeCancellation !== undefined) {
  const bool = freeCancellation === true || freeCancellation === 'true' ? 'true' : 'false';

  whereClauses.push(Sequelize.literal(`(
    data->>'FreeCancellation' = '${bool}' OR 
    data->>'freeCancellation' = '${bool}'
  )`));
}



if (RemainingSeats !== undefined) {
  const seats = parseInt(RemainingSeats, 10);
  whereClauses.push(Sequelize.literal(`(
    (data->>'RemainingSeats')::int >= ${seats} OR
    (data->>'remainingSeats')::int >= ${seats}
  )`));
}


if (availableDays) {
  const daysArray = Array.isArray(availableDays)
    ? availableDays
    : String(availableDays).split(",").map(d => d.trim());

  for (const day of daysArray) {
    whereClauses.push(
      Sequelize.literal(`"data"->'availableDays' ? '${day}'`)
    );
  }
}



  if (supplier !== undefined) {
  whereClauses.push(Sequelize.literal(`data->'supplier'->>'name' ILIKE '%${supplier}%'`));
}


   if (averageRating) {
  whereClauses.push(
    Sequelize.literal(`(
      (data->>'averageRating')::float >= ${parseFloat(averageRating)} OR
      (data->>'AverageRating')::float >= ${parseFloat(averageRating)}
    )`)
  );
}

    if (startTime) {
      whereClauses.push(
        Sequelize.where(Sequelize.json('data.startTime') as any, { [Op.iLike]: `%${startTime}%` })
      );
    }

    if (experienceType) {
      whereClauses.push(
        Sequelize.where(Sequelize.json('data.experienceType') as any, { [Op.iLike]: `%${experienceType}%` })
      );
    }

    if (GroupMin) {
      whereClauses.push(
        Sequelize.where(Sequelize.json('data.GroupMin') as any, { [Op.lte]: parseInt(GroupMin, 10) })
      );
    }

    if (GroupMax) {
      whereClauses.push(
        Sequelize.where(Sequelize.json('data.GroupMax') as any, { [Op.gte]: parseInt(GroupMax, 10) })
      );
    }

    if (popularity === true || popularity === 'true') {
      whereClauses.push(
        Sequelize.where(Sequelize.json('data.popularity') as any, true)
      );
    }

    if (groupType) {
      whereClauses.push(
        Sequelize.where(Sequelize.json('data.groupType') as any, { [Op.iLike]: `%${groupType}%` })
      );
    }

    const results = await ExperienceJson.findAll({
      where: {
        [Op.and]: whereClauses,
      },
      order: sortBy && sortOrder ? [[Sequelize.json(`data.${sortBy}`) as any, sortOrder]] : undefined,
    });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la recherche", details: error });
  }
};

/**
 * @swagger
 * /api/experiences/stats/count:
 *   get:
 *     summary: Obtenir le nombre total d’expériences
 *     tags: [Statistiques]
 *     responses:
 *       200:
 *         description: Nombre total d'expériences
 */
export const countExperiences = async (_req: Request, res: Response): Promise<void> => {
  try {
    const count = await ExperienceJson.count();
    res.status(200).json({ total: count });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du comptage." });
  }
};

/**
 * @swagger
 * /api/experiences/available/today:
 *   get:
 *     summary: Obtenir les expériences disponibles aujourd’hui
 *     tags: [Expériences]
 *     responses:
 *       200:
 *         description: Expériences disponibles aujourd’hui
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   data:
 *                     type: object
 *       500:
 *         description: Server error
 */
export const getTodayAvailableExperiences = async (_req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const dayOfWeek = new Date()
      .toLocaleDateString("fr-FR", { weekday: "long" })
      .replace(/^\w/, (c) => c.toUpperCase());

    const results = await sequelize.query(
      `
      SELECT "id", "data", "createdAt", "updatedAt"
      FROM "experienceJsons"
      WHERE (
        "data"->>'availability' IS NOT NULL
        AND "data"->'availability'->>'start' IS NOT NULL
        AND "data"->'availability'->>'end' IS NOT NULL
        AND "data"->'availability'->>'start' ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
        AND "data"->'availability'->>'end' ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
        AND CAST("data"->'availability'->>'start' AS date) <= :today
        AND CAST("data"->'availability'->>'end' AS date) >= :today
        AND (
          "data"->>'availableDays' IS NULL
          OR "data"->>'availableDays' = '[]'
          OR EXISTS (
            SELECT 1
            FROM jsonb_array_elements_text("data"->'availableDays') AS day
            WHERE day = :dayOfWeek OR day = 'Tous les jours'
          )
        )
      )
      `,
      {
        replacements: { today, dayOfWeek },
        type: QueryTypes.SELECT,
        logging: (msg) => console.log('Sequelize:', msg),
      }
    );

    res.status(200).json(results);
  } catch (error: any) {
    console.error("Erreur getTodayAvailableExperiences:", JSON.stringify(error, null, 2));
    res.status(500).json({ error: "Erreur lors de la récupération des expériences du jour.", details: error.message, stack: error.stack });
  }
};

/**
 * @swagger
 * /api/experiences/available/by-date:
 *   post:
 *     summary: Get experiences available on a specific date
 *     description: Retrieves experiences available on the specified date, considering start/end dates and available days of the week.
 *     tags: [Expériences]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-15"
 *                 description: Date to check availability (format YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of available experiences
 *       400:
 *         description: Invalid or missing date
 *       500:
 *         description: Server error
 */
export const getTodayAvailablebydate: RequestHandler = async (req, res) => {
  try {
    const { date } = req.body;
    if (!date || typeof date !== "string" || !isValid(parseISO(date))) {
      res.status(400).json({ error: "Invalid or missing date. Use YYYY-MM-DD format." });
      return;
    }
    const parsedDate = parseISO(date);
    const dayOfWeek = parsedDate
      .toLocaleDateString("fr-FR", { weekday: "long" })
      .replace(/^\w/, (c) => c.toUpperCase());

    const results = await sequelize.query(
      `
      SELECT "id", "data", "createdAt", "updatedAt"
      FROM "experienceJsons"
      WHERE (
        "data"->>'availability' IS NOT NULL
        AND "data"->'availability'->>'start' IS NOT NULL
        AND "data"->'availability'->>'end' IS NOT NULL
        AND "data"->'availability'->>'start' ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
        AND "data"->'availability'->>'end' ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
        AND CAST("data"->'availability'->>'start' AS date) <= :date
        AND CAST("data"->'availability'->>'end' AS date) >= :date
        AND (
          EXISTS (
            SELECT 1
            FROM jsonb_array_elements_text("data"->'availableDays') AS day
            WHERE day = :dayOfWeek
          ) OR "data"->>'availableDays' IS NULL
        )
      )
      `,
      {
        replacements: { date, dayOfWeek },
        type: QueryTypes.SELECT,
        logging: (msg) => console.log('Sequelize:', msg),
      }
    );

    res.status(200).json(results);
    return;
  } catch (error: any) {
    console.error("Error in getTodayAvailablebydate:", JSON.stringify(error, null, 2));
    res.status(500).json({ error: "Server error", details: error.message, stack: error.stack });
    return;
  }
};

/**
 * @swagger
 * /api/experiences/stats/by-city:
 *   get:
 *     summary: Statistiques des expériences par ville
 *     tags: [Statistiques]
 *     responses:
 *       200:
 *         description: Statistiques des villes
 */
export const getExperienceStatsByCity = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [results] = await sequelize.query(`
      SELECT 
        TRIM(data->>'city') AS city,
        COUNT(*) AS total
      FROM "experienceJsons"
      WHERE data->>'city' IS NOT NULL AND TRIM(data->>'city') <> ''
      GROUP BY city
      ORDER BY total DESC
    `);

    res.status(200).json(results);
  } catch (error) {
    console.error('Erreur statistiques par ville :', error);
    res.status(500).json({ error: "Erreur statistiques par ville." });
  }
};


/**
 * @swagger
 * /api/experiences/stats/by-country:
 *   get:
 *     summary: Statistiques des expériences par pays
 *     tags: [Statistiques]
 *     responses:
 *       200:
 *         description: Statistiques des pays
 */
export const getExperienceStatsByCountry = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [results] = await sequelize.query(`
      SELECT 
        TRIM(data->>'country') AS country,
        COUNT(*) AS total
      FROM "experienceJsons"
      WHERE data->>'country' IS NOT NULL AND TRIM(data->>'country') <> ''
      GROUP BY country
      ORDER BY total DESC
    `);

    res.status(200).json(results);
  } catch (error) {
    console.error('Erreur statistiques par ville :', error);
    res.status(500).json({ error: "Erreur statistiques par ville." });
  }
};

/**
 * @swagger
 * /api/experiences/latest:
 *   get:
 *     summary: Obtenir les dernières expériences ajoutées
 *     tags: [Expériences]
 *     responses:
 *       200:
 *         description: Dernières expériences
 */
export const getLatestExperiences = async (_req: Request, res: Response): Promise<void> => {
  try {
    const latest = await ExperienceJson.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5
    });
    res.status(200).json(latest);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des nouvelles expériences." });
  }
};

/**
 * @swagger
 * /api/experiences/top-rated:
 *   get:
 *     summary: Obtenir les expériences les mieux notées
 *     tags: [Expériences]
 *     responses:
 *       200:
 *         description: Expériences avec les meilleures notes
 */
export const getTopRatedExperiences = async (_req: Request, res: Response): Promise<void> => {
  try {
    const topExperiences = await ExperienceJson.findAll({
      where: Sequelize.where(
        Sequelize.json('data.rating.average') as any,
        { [Op.not]: null }
      ),
      order: [[Sequelize.json('data.rating.average') as any, 'DESC']],
      limit: 5
    });

    res.status(200).json(topExperiences);
  } catch (error) {
    console.error("Erreur getTopRatedExperiences :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des meilleures expériences." });
  }
};


/**
 * @swagger
 * /api/experiences/free-cancellation:
 *   get:
 *     summary: Expériences avec annulation gratuite
 *     tags: [Expériences]
 *     responses:
 *       200:
 *         description: Résultat avec annulation gratuite
 */
export const getFreeCancellationExperiences = async (_req: Request, res: Response) => {
  try {
    const results = await ExperienceJson.findAll({
      where: Sequelize.literal(`(data->>'freeCancellation')::boolean = true`)
    });
    res.status(200).json(results);
  } catch (error) {
    console.error("Erreur SQL annulation gratuite :", error);
    res.status(500).json({
      error: "Erreur récupération expériences avec annulation gratuite.",
      details: error
    });
  }
};

/**
 * @swagger
 * /api/experiences/low-stock:
 *   get:
 *     summary: Expériences avec peu de places restantes
 *     tags: [Expériences]
 *     responses:
 *       200:
 *         description: Résultat avec peu de disponibilités
 */
export const getExperiencesWithFewSpotsLeft = async (_req: Request, res: Response) => {
  try {
    const results = await ExperienceJson.findAll({
      where: Sequelize.literal(`(data->>'remainingSeats')::int <= 3`)
    });
    res.status(200).json(results);
  } catch (error) {
    console.error("Erreur SQL:", error);
    res.status(500).json({ error: "Erreur récupération expériences peu disponibles.", details: error });
  }
};

/**
 * @swagger
 * /api/experiences/almost-full:
 *   get:
 *     summary: Récupérer les expériences avec 2 places restantes ou moins
 *     tags:
 *       - Expériences
 *     responses:
 *       200:
 *         description: Liste des expériences presque complètes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Experience'
 *       500:
 *         description: Erreur serveur lors de la récupération
 */
export const getAlmostFullExperiences = async (_req: Request, res: Response) => {
  try {
    const results = await ExperienceJson.findAll({
      where: Sequelize.literal(`(data->>'remainingSeats')::int <= 2`)
    });
    res.status(200).json(results);
  } catch (error) {
    console.error("Erreur getAlmostFullExperiences:", error);
    res.status(500).json({ error: "Erreur récupération", details: error });
  }
};

/**
 * @swagger
 * /api/experiences/{id}/reviews:
 *   get:
 *     summary: Récupérer les avis d'une expérience spécifique
 *     tags:
 *       - Expériences
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'expérience
 *     responses:
 *       200:
 *         description: Liste des avis récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                   rating:
 *                     type: integer
 *                     example: 4
 *                   author:
 *                     type: string
 *                   comment:
 *                     type: string
 *       404:
 *         description: Expérience introuvable
 *       500:
 *         description: Erreur lors de la récupération des avis
 */
export const getExperienceReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const experience = await ExperienceJson.findByPk(req.params.id);
    if (!experience) {
      res.status(404).json({ message: "Expérience introuvable" });
      return;
    }

    const reviews = experience.dataValues.data?.rating?.reviews ?? [];
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Erreur récupération des avis", details: error });
  }
};


/**
 * @swagger
 * /api/experiences/favorites/{userId}:
 *   get:
 *     summary: Obtenir les expériences favorites d’un utilisateur
 *     tags: [Expériences]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des expériences favorites
 */
export const getUserFavorites = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const favorites = await Favorite.findAll({ where: { userId } });
    const experienceIds = favorites.map((fav) => fav.experienceId);
    const experiences = await ExperienceJson.findAll({
      where: { id: experienceIds },
    });
    res.status(200).json(experiences);
  } catch (error) {
    console.error("Erreur getUserFavorites:", error);
    res.status(500).json({ error: "Erreur récupération favoris", details: error });
  }
};

/**
 * @swagger
 * /api/experiences/{id}/reviews:
 *   post:
 *     summary: Ajouter un avis à une expérience
 *     description: Ajoute un nouvel avis (note, commentaire, auteur) à l'expérience spécifiée.
 *     tags:
 *       - Expériences
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'expérience
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - author
 *               - rating
 *               - comment
 *             properties:
 *               author:
 *                 type: string
 *                 example: Alice
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: Très belle expérience, guide super sympa !
 *     responses:
 *       201:
 *         description: Avis ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Avis ajouté
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       author:
 *                         type: string
 *                       rating:
 *                         type: number
 *                       comment:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: 2025-07-15
 *       404:
 *         description: Expérience introuvable
 *       500:
 *         description: Erreur lors de l'ajout de l'avis
 */
export const addExperienceReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { author, rating, comment } = req.body;

  try {
    const experience = await ExperienceJson.findByPk(id);
    if (!experience) return res.status(404).json({ message: "Expérience introuvable" });

    const data = experience.getDataValue('data');
    if (!Array.isArray(data.reviews)) data.reviews = [];

    data.reviews.push({ author, rating, comment, date: new Date().toISOString().split("T")[0] });
    await experience.update({ data });

    res.status(201).json({ message: "Avis ajouté", reviews: data.reviews });
  } catch (error) {
    res.status(500).json({ error: "Erreur ajout avis", details: error });
  }
};