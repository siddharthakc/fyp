const express = require("express");
const {
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController,
} = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Endpoint to fetch all users
router.get("/getAllUsers", authMiddleware, getAllUsersController);

// Endpoint to fetch all doctors
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

// Endpoint to change account status
router.post(
  "/changeAccountStatus",
  authMiddleware,
  changeAccountStatusController
);

module.exports = router;
