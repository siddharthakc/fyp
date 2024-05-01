const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDocotrsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// Router object
const router = express.Router();

// Routes
// POST || Login user
router.post("/login", loginController);

// POST || Register user
router.post("/register", registerController);

// Auth || POST
router.post("/getUserData", authMiddleware, authController);

// Apply Doctor || POST
router.post("/apply-doctor", authMiddleware, applyDoctorController);

// Notification Doctor || POST
router.post(
  "/get-all-notification",
  authMiddleware,
  getAllNotificationController
);

// Notification Doctor || POST
router.post(
  "/delete-all-notification",
  authMiddleware,
  deleteAllNotificationController
);

// GET ALL DOCTORS
router.get("/getAllDoctors", authMiddleware, getAllDocotrsController);

// BOOK APPOINTMENT
router.post("/book-appointment", authMiddleware, bookAppointmentController);

// Booking Availability
router.post(
  "/booking-availability",
  authMiddleware,
  bookingAvailabilityController
);

// Appointments List
router.get("/user-appointments", authMiddleware, userAppointmentsController);

module.exports = router;
