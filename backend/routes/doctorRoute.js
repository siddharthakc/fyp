const express = require("express");
const {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
} = require("../controllers/doctorController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

// Endpoint to post single doctor info
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

// Endpoint to update doctor profile
router.post("/updateProfile", authMiddleware, updateProfileController);

// Endpoint to post get single doctor info
router.post("/getDoctorById", authMiddleware, getDoctorByIdController);

// Endpoint to get doctor appointments
router.get(
  "/doctor-appointments",
  authMiddleware,
  doctorAppointmentsController
);

// Endpoint to post update status
router.post("/update-status", authMiddleware, updateStatusController);

module.exports = router;
