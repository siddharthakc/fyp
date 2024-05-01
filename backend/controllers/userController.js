const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const jwt = require("jsonwebtoken");
const moment = require("moment");

// login callback
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send("user not found");
    }
    // Compare hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send("invalid password");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "login success", success: true, token });
  } catch (error) {
    console.log(error);
    console.log(process.env.JWT_SECRET);
    res.status(500).send({ message: `error in login ctrl ${error.message}` });
  }
};

// register callback
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash and salt password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      newUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

// authenticate user
const authController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      user.password = undefined; // move this line here
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

// apply for doctor account
const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "doctor account applied successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "error while applying for doctor",
    });
  }
};

// get all notifications
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "all notifications marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in notification",
      success: false,
      error,
    });
  }
};

// delete all notifications
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "notifications deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "unable to delete all notifications",
      error,
    });
  }
};

// get all doctors
const getAllDocotrsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "doctors lists fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "error while fetching doctor",
    });
  }
};

// checking availability of appointment
const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const startTime = moment(req.body.time, "HH:mm").toISOString();
    const doctorId = req.body.doctorId;
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).send({
        message: "doctor not found",
        success: false,
      });
    }
    const start = moment(doctor.starttime, "HH:mm").toISOString();
    const end = moment(doctor.endtime, "HH:mm").toISOString();
    if (!moment(startTime).isBetween(start, end, undefined, "[]")) {
      return res.status(200).send({
        message: "appointment not available",
        success: false,
      });
    }
    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: startTime,
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "appointment not available",
        success: false,
      });
    }
    return res.status(200).send({
      success: true,
      message: "appointment available",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "error checking appointment availability",
    });
  }
};

// book appointment
const bookAppointmentController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const startTime = moment(req.body.time, "HH:mm").toISOString();
    const doctorId = req.body.doctorId;
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).send({
        message: "doctor not found",
        success: false,
      });
    }
    const start = moment(doctor.starttime, "HH:mm").toISOString();
    const end = moment(doctor.endtime, "HH:mm").toISOString();
    if (!moment(startTime).isBetween(start, end, undefined, "[]")) {
      return res.status(400).send({
        message: "selected time is not within doctor's available range",
        success: false,
      });
    }
    const appointments = await appointmentModel.find({
      doctorId,
      date,
    });
    if (appointments.length >= doctor.maxPatientsPerDay) {
      return res.status(400).send({
        message: "maximum number of appointments reached for this day",
        success: false,
      });
    }
    const existingAppointment = await appointmentModel.findOne({
      doctorId,
      date,
      time: startTime,
    });
    if (existingAppointment) {
      return res.status(400).send({
        message: "appointment already booked for this time slot",
        success: false,
      });
    }
    const newAppointment = new appointmentModel({
      doctorId,
      userId: req.body.userId,
      date,
      time: startTime,
      doctorInfo: req.body.doctorInfo,
      userInfo: req.body.userInfo,
    });
    await newAppointment.save();
    return res.status(200).send({
      success: true,
      message: "appointment booked successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "error in booking appointment",
    });
  }
};

// get user appointments
const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "users appointments fetch successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "error in user appointments",
    });
  }
};

module.exports = {
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
};
