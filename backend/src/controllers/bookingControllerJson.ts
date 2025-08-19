import { Request, Response } from "express";
import BookingJson from "../models/bookingJson";
import ExperienceJson from "../models/experienceJson";
import { Sequelize, Op } from "sequelize";
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { experienceId, nombreParticipants } = req.body;

    const experience = await ExperienceJson.findByPk(experienceId);
    if (!experience) {
      res.status(404).json({ error: "Expérience non trouvée" });
      return;
    }

    const experienceData = experience.get() as any;
    const placesRestantes = experienceData.data?.nombrePlacesRestantes || 0;

    if (nombreParticipants > placesRestantes) {
      res.status(400).json({ error: "Nombre de places insuffisant" });
      return;
    }

    const newBooking = await BookingJson.create({ data: req.body });

    // Fix: decrement inside data object
    experienceData.data.nombrePlacesRestantes -= nombreParticipants;

    //  Fix: update only inner data object
    await experience.update({ data: experienceData.data });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: "Erreur lors de la création de la réservation", details: error });
  }
};

export const getAllBookings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await BookingJson.findAll();
     res.status(200).json(bookings);
  } catch (error) {
     res.status(500).json({ error: "Erreur récupération", details: error });
  }
};

export const getBookingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const booking = await BookingJson.findByPk(req.params.id);
    if (!booking) {
      res.status(404).json({ message: "Réservation introuvable" });
      return; // ← à ajouter ici !
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: "Erreur récupération", details: error });
  }
};


export const updateBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const booking = await BookingJson.findByPk(req.params.id);
    if (!booking) {
         res.status(404).json({ message: "Réservation introuvable" });
         return;
    }

    await booking.update({ data: req.body });
     res.status(200).json(booking);
  } catch (error) {
     res.status(500).json({ error: "Erreur modification", details: error });
  }
};

export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const booking = await BookingJson.findByPk(req.params.id);
    if (!booking) {
      res.status(404).json({ message: "Réservation introuvable" });
      return;
    }

    await booking.destroy();
     res.status(204).send();
  } catch (error) {
     res.status(500).json({ error: "Erreur suppression", details: error });
  }
};
// réservations faites par un utilisateur
export const getBookingsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const results = await BookingJson.findAll({
      where: Sequelize.where(Sequelize.json('data.userId') as any, userId)
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des réservations utilisateur", details: error });
  }
};
//les réservations d’une date spécifique
export const getBookingsByDate = async (req: Request, res: Response) => {
  const { date } = req.query;

  try {
    const results = await BookingJson.findAll({
      where: Sequelize.where(Sequelize.json('data.dateReservation') as any, date)
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Erreur récupération réservations par date" });
  }
};
//supprimer une réservation et remettre à jour les places restantes
export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const booking = await BookingJson.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ error: "Réservation introuvable" });

    const bookingData = booking.get() as any;
    const experienceId = bookingData.data.experienceId;
    const nombreParticipants = bookingData.data.nombreParticipants;

    const experience = await ExperienceJson.findByPk(experienceId);
    if (experience) {
      const expData = experience.get() as any;
      expData.data.nombrePlacesRestantes += nombreParticipants;
      await experience.update({ data: expData.data });
    }

    await booking.destroy();
    res.status(200).json({ message: "Réservation annulée avec succès." });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'annulation de la réservation", details: error });
  }
};
//marquer une réservation comme confirmée
export const confirmBooking = async (req: Request, res: Response) => {
  try {
    const booking = await BookingJson.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ error: "Réservation introuvable" });

    const data = booking.get() as any;
    data.data.confirmed = true;

    await booking.update({ data: data.data });
    res.status(200).json({ message: "Réservation confirmée." });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la confirmation", details: error });
  }
};

export const searchBookings = async (req: Request, res: Response) => {
  const {
    nomClient,
    emailClient,
    villeExperience,
    status,
    dateDebut,
    dateFin,
    payee,
    typeExperience,
    heureReservation,
    nombreParticipantsMin,
    nombreParticipantsMax,
    groupePrive
  } = req.query;

  const whereClauses: any[] = [];

  if (nomClient) {
    whereClauses.push(
      Sequelize.where(
        Sequelize.json('data.nomClient') as any,
        { [Op.iLike]: `%${nomClient}%` }
      )
    );
  }

  if (emailClient) {
    whereClauses.push(
      Sequelize.where(
        Sequelize.json('data.emailClient') as any,
        { [Op.iLike]: `%${emailClient}%` }
      )
    );
  }

  if (villeExperience) {
    whereClauses.push(
      Sequelize.where(
        Sequelize.json('data.villeExperience') as any,
        { [Op.iLike]: `%${villeExperience}%` }
      )
    );
  }

  if (status) {
    whereClauses.push(
      Sequelize.where(
        Sequelize.json('data.status') as any,
        { [Op.iLike]: `%${status}%` }
      )
    );
  }

  if (dateDebut) {
    whereClauses.push(
      Sequelize.where(
        Sequelize.json('data.dateReservation') as any,
        { [Op.gte]: dateDebut }
      )
    );
  }

  if (dateFin) {
    whereClauses.push(
      Sequelize.where(
        Sequelize.json('data.dateReservation') as any,
        { [Op.lte]: dateFin }
      )
    );
  }

  if (payee !== undefined) {
    const payeeBool = payee === 'true';
    whereClauses.push(
      Sequelize.where(Sequelize.json('data.payee') as any, payeeBool)
    );
  }

  if (typeExperience) {
    whereClauses.push(
      Sequelize.where(
        Sequelize.json('data.typeExperience') as any,
        { [Op.iLike]: `%${typeExperience}%` }
      )
    );
  }

  if (heureReservation) {
    whereClauses.push(
      Sequelize.where(
        Sequelize.json('data.heureReservation') as any,
        { [Op.iLike]: `%${heureReservation}%` }
      )
    );
  }

  if (nombreParticipantsMin) {
    whereClauses.push(
      Sequelize.where(
        Sequelize.json('data.nombreParticipants') as any,
        { [Op.gte]: parseInt(nombreParticipantsMin as string, 10) }
      )
    );
  }

  if (nombreParticipantsMax) {
    whereClauses.push(
      Sequelize.where(
        Sequelize.json('data.nombreParticipants') as any,
        { [Op.lte]: parseInt(nombreParticipantsMax as string, 10) }
      )
    );
  }

  if (groupePrive !== undefined) {
    const groupeBool = groupePrive === 'true';
    whereClauses.push(
      Sequelize.where(
        Sequelize.json('data.groupePrive') as any,
        groupeBool
      )
    );
  }

  try {
    const bookings = await BookingJson.findAll({
      where: whereClauses.length > 0 ? { [Op.and]: whereClauses } : {}
    });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Erreur recherche réservation :", error);
    res.status(500).json({ error: "Erreur lors de la recherche des réservations", details: error });
  }
};

