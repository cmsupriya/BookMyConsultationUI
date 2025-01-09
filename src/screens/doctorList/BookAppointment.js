import React, { useState, useEffect, useContext } from "react";
import "./bookappointment.css";
import { doBookAppointment, getDoctor } from '../../util/fetch';
import useService from "../../common/hooks/useService";
import useAuth from "../../common/hooks/useAuth";
import { Button, TextField } from '@mui/material';

const BookAppointment = ({ doctor }) => {
  const { AuthCtx } = useAuth();
  const { accessToken, loggedInUser, loggedInUserId  } = useContext(AuthCtx);
  const [appointment, setAppointment] = useState({
    appointmentDate: "",
    timeSlot: "",
    priorMedicalHistory: "",
    symptoms: "",
    doctorId: doctor.id,
    doctorName: doctor.firstName + " " + doctor.lastName,
    userId: loggedInUserId,
    userName: loggedInUserId,
    userEmailId: loggedInUserId
  });
  const { ServicesCtx } = useService();
  const { showMessage } = useContext(ServicesCtx);

  const handleSubmit = () => {
    doBookAppointment(accessToken, appointment)
      .then((json) => {
        showMessage("Appointment booked successfully!");
      })
      .catch((json) => {
        showMessage(json.reason, "error");
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAppointment((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="book-appointment-modal">
        <div className="modal-header">
          <h2>Book an Appointment</h2>
        </div>
        <div className="modal-content">
          <label htmlFor="doctorName">Doctor's Name</label>
          <input
            id="doctorName"
            type="text"
            value={appointment.doctorName}
            disabled
          />
          {/* Add the date picker component */}
          <label htmlFor="appointmentDate">Appointment Date</label>
          <input
            id="appointmentDate"
            type="date"
            name="appointmentDate"
            value={appointment.appointmentDate}
            onChange={handleInputChange}
          />
          {/* Add the time slot component */}
          <label htmlFor="timeSlot">Time Slot</label>
          <input
            id="timeSlot"
            type="time"
            name="timeSlot"
            value={appointment.timeSlot}
            onChange={handleInputChange}
          />
          <label htmlFor="priorMedicalHistory">Medical History</label>
          <TextField variant="standard" multiline id="priorMedicalHistory" rows={3} name="priorMedicalHistory" value={appointment.priorMedicalHistory} onChange={handleInputChange} />
          <label htmlFor="symptoms">Symptoms</label>
          <TextField variant="standard" multiline id="symptoms" rows={3} name="symptoms" value={appointment.symptoms} onChange={handleInputChange} />
          <Button color='primary' variant='contained' size="small" className="book-appointment-button" onClick={handleSubmit}>
            Book Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
