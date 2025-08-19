import express from "express";
import {
   createExperience,
  getAllExperiences,
    //addExperienceReview,
  getExperienceReviews,
  getExperienceById,
  updateExperience,
  deleteExperience,
  deleteAllExperiences,
  searchExperiences,
  countExperiences,
  getTodayAvailableExperiences,
  getTodayAvailablebydate,
  getExperienceStatsByCity,
  getLatestExperiences,
  getTopRatedExperiences,
  getExperiencesWithFewSpotsLeft,
  getFreeCancellationExperiences,
  getExperienceStatsByCountry,
  getAlmostFullExperiences,
  getUserFavorites, 
  //getAllBundles,
 } from "../controllers/experienceControllerJson";

const router = express.Router();


router.post("/", createExperience);
router.get("/", getAllExperiences);
router.put("/:id", updateExperience);
router.delete("/delete-all", deleteAllExperiences);
router.delete("/:id", deleteExperience);
//router.get("/search", searchExperiences);
router.post("/search", searchExperiences);

router.get("/stats/count", countExperiences);
router.get("/almost-full", getAlmostFullExperiences);
router.post("/available/by-date", getTodayAvailablebydate);
router.get("/available/today", getTodayAvailableExperiences);
router.get("/stats/by-country", getExperienceStatsByCountry);
router.get("/stats/by-city", getExperienceStatsByCity);
router.get("/top-rated", getTopRatedExperiences);
router.get("/latest", getLatestExperiences);
router.get("/low-stock", getExperiencesWithFewSpotsLeft);
router.get("/free-cancellation", getFreeCancellationExperiences);
router.get('/favorites/:userId', getUserFavorites);
//router.get('/bundles', getAllBundles);
//router.post("/:id/reviews", addExperienceReview);
router.get("/:id/reviews", getExperienceReviews);
router.get("/:id", getExperienceById);

export default router;
