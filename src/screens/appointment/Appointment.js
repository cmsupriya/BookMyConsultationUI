import React, { useState, useContext, useEffect } from "react";
import "./appointment.css";
import RateAppointment from "./RateAppointment";
import { getAppointments } from '../../util/fetch';
import useService from "../../common/hooks/useService";
import useAuth from "../../common/hooks/useAuth";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";

const Appointment = () => {
  const { AuthCtx } = useAuth();
  const { accessToken, loggedInUserId } = useContext(AuthCtx);
  const { ServicesCtx } = useService();
  const { showMessage } = useContext(ServicesCtx);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [showRateAppointment, setShowRateAppointment] = useState(false);

  useEffect(() => {
    if (loggedInUserId != null) {
      getAppointments(loggedInUserId, accessToken)
        .then((json) => {
          setAppointments(json);
        })
        .catch((json) => {
          showMessage(json.reason, "error");
        });
    }
  }, [loggedInUserId, accessToken]);

  const handleRateAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRateAppointment(true);
  };

  return (
    <div className="appointment-container">
      {
        loggedInUserId == null &&
        <div>
          <center><h4>Login to see appointments</h4></center>
        </div>
      }
      {loggedInUserId != null && appointments.length > 0 && appointments.map((appointment, index) => (
        <Box key={index} className="appointment-item" sx={(theme) => ({ boxShadow: 1, borderRadius: 1 })}>
          <div>
            <h3>Doctor's Name : {appointment.doctorName}</h3>
            <h5>Appointment Date : {appointment.appointmentDate}</h5>
            <h5>Symptoms : {appointment.symptoms}</h5>
            <h5>Previous Medical History : {appointment.priorMedicalHistory}</h5>
            <Button color="primary" variant="contained" size="small" onClick={() => handleRateAppointment(appointment)}>
              RATE APPOINTMENT
            </Button>
          </div>
          {showRateAppointment && selectedAppointment && (
            <div>
              <h2>Rate Appointment Component</h2>
              <RateAppointment appointment={selectedAppointment} />
            </div>
          )}
        </Box>
      ))}
    </div>
  );
};

export default Appointment;
