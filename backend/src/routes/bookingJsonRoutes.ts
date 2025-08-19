import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getBookingsByUserId,
  getBookingsByDate,
  confirmBooking,
  cancelBooking,
} from "../controllers/bookingControllerJson";

const router = express.Router();
router.get("/user/:userId", getBookingsByUserId);
router.get("/by-date", getBookingsByDate);
//router.delete("/cancel/:id", cancelBooking);
//router.put("/confirm/:id", confirmBooking);
router.post("/", createBooking);          
router.get("/", getAllBookings);
router.put("/:id", updateBooking);
router.get("/:id", getBookingById);
router.delete("/:id", deleteBooking);
 
export default router;
