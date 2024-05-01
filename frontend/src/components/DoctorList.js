import React from "react";
import { useNavigate } from "react-router-dom";

const DoctorList = ({ doctor }) => {
  const navigate = useNavigate();

  const formatTimings = (startTime, endTime) => {
    return `${startTime} - ${endTime}`;
  };

  const formatFees = (fees) => {
    return `$${fees}`;
  };

  return (
    <div
      className="card m-2"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
    >
      <div
        className="card-header"
        style={{ textAlign: "center", fontWeight: "bold" }}
      >
        Dr. {doctor.firstName} {doctor.lastName}
      </div>
      <div className="card-body">
        <p>
          <b>Specialization:</b> {doctor.specialization}
        </p>
        <p>
          <b>Experience:</b> {doctor.experience}
        </p>
        <p>
          <b>Fees Per Consultation:</b> {formatFees(doctor.feesPerConsultation)}
        </p>
        <p>
          <b>Timings:</b> {formatTimings(doctor.starttime, doctor.endtime)}
        </p>
        <p>
          <b>Email:</b> {doctor.email}
        </p>
        <p>
          <b>Phone:</b> {doctor.phone}
        </p>
        <p>
          <b>Address:</b> {doctor.address}
        </p>
        <p>
          <b>Website:</b> {doctor.website || "N/A"}
        </p>
        {/* Additional features can be added here */}
      </div>
    </div>
  );
};

export default DoctorList;
