import React, { useState, useContext, useEffect } from "react";
import "./appointment.css";
import RateAppointment from "./RateAppointment";
import { getAppointments } from '../../util/fetch';
import useService from "../../common/hooks/useService";
import useAuth from "../../common/hooks/useAuth";
import { Button, Box, Modal } from "@mui/material";

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
  }, []);

  const handleRateAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRateAppointment(true);
  };

  const handleClose = () => setShowRateAppointment(false);

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
            <h4>Dr: {appointment.doctorName}</h4>
            <h5>Appointment Date : {appointment.appointmentDate}</h5>
            <h5>Symptoms : {appointment.symptoms}</h5>
            <h5>Previous Medical History : {appointment.priorMedicalHistory}</h5>
            <Button color="primary" variant="contained" size="small" onClick={() => handleRateAppointment(appointment)}>
              RATE APPOINTMENT
            </Button>
          </div>
        </Box>
      ))}

      {showRateAppointment && selectedAppointment && (
        <Modal
          open={showRateAppointment}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
          <Box className="modal-overlay">
            <RateAppointment appointment={selectedAppointment} />
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default Appointment;
