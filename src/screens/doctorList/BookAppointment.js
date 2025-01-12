import React, { useState, useEffect, useContext } from "react";
import "./bookappointment.css";
import { doBookAppointment, getTimeSlots } from '../../util/fetch';
import useService from "../../common/hooks/useService";
import useAuth from "../../common/hooks/useAuth";
import { Button, TextField, Select, MenuItem, InputLabel, FormControl, FormHelperText } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const BookAppointment = ({ doctor }) => {

  const { AuthCtx } = useAuth();
  const { accessToken, loggedInUser, loggedInUserId } = useContext(AuthCtx);
  const { ServicesCtx } = useService();
  const { showMessage } = useContext(ServicesCtx);

  const [timeSlots, setTimeSlots] = useState([]);
  const [appointment, setAppointment] = useState({
    appointmentDate: dayjs(new Date()),
    timeSlot: "None",
    priorMedicalHistory: "",
    symptoms: "",
    doctorId: doctor.id,
    doctorName: doctor.firstName + " " + doctor.lastName,
    userId: loggedInUserId,
    userName: loggedInUserId,
    userEmailId: loggedInUserId
  });
  const [errorState, setErrorState] = useState({
    timeSlot: {
      error: false,
      errorMessage: null
    },
  });

  useEffect(() => {
    findTimeSlots(appointment.doctorId, appointment.appointmentDate);
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAppointment((prevData) => ({
      ...prevData,
      [name]: value
    }));
    if (name === "timeSlot")
      validateTimeSlot();
  };

  const validateTimeSlot = () => {
    if (appointment.timeSlot === "None") {
      setErrorState({ timeSlot: { error: true, errorMessage: "Select a time slot" } });
      return false;
    } else {
      setErrorState({ timeSlot: { error: false, errorMessage: null } });
      return true;
    }
  };

  const handleDateChange = (newDate) => {
    appointment.appointmentDate = newDate;
    appointment.timeSlot = "None";
    findTimeSlots(appointment.doctorId, appointment.appointmentDate);
  };

  const findTimeSlots = (doctorId, appointmentDate) => {
    appointmentDate = appointmentDate.toISOString().split("T")[0];
    getTimeSlots(doctorId, appointmentDate)
      .then((json) => {
        setTimeSlots(json.timeSlot);
      })
      .catch((json) => {
        showMessage(json.reason, "error");
      });
  };

  const handleSubmit = () => {
    if (validateTimeSlot()) {
      let appointmentData = { ...appointment };
      appointmentData.appointmentDate = appointmentData.appointmentDate.toISOString().split("T")[0];
      doBookAppointment(accessToken, appointmentData)
        .then((json) => {
          showMessage("Appointment booked successfully!");
        })
        .catch((json) => {
          showMessage(json.reason, "error");
        });
    }
  };

  return (
    <div className="book-appointment-modal">
      <div className="modal-header">
        <h2>Book an Appointment</h2>
      </div>
      <div className="modal-content">
        <TextField id="doctorName" value={appointment.doctorName} variant="standard" label="Doctor's Name *"
          className="doctor-name" disabled />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker id="appointmentDate" name="appointmentDate" className="appointment-date" value={appointment.appointmentDate}
            slotProps={{ textField: { variant: 'standard' } }} label="Appointment Date *" onChange={handleDateChange} />
        </LocalizationProvider>

        <FormControl className="time-slot" variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="time-slot-label">Time Slot *</InputLabel>
          <Select id="timeSlot" name="timeSlot" value={appointment.timeSlot} labelId="time-slot-label"
            onChange={handleInputChange}
            onBlur={validateTimeSlot}>
            <MenuItem value="None">None</MenuItem>
            {timeSlots.map((timeSlot) => (
              <MenuItem key={timeSlot} value={timeSlot}>
                {timeSlot}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error={errorState.timeSlot.error}>{errorState.timeSlot.errorMessage}</FormHelperText>
        </FormControl>

        <TextField variant="standard" label="Medical History" multiline id="priorMedicalHistory" rows={3} name="priorMedicalHistory"
          value={appointment.priorMedicalHistory} onChange={handleInputChange} className="prior-medical-history" />

        <TextField variant="standard" multiline id="symptoms" rows={3} name="symptoms" label="Symptoms"
          value={appointment.symptoms} onChange={handleInputChange} className="symptoms" />

        <Button color='primary' variant='contained' size="small" className="book-appointment-button" onClick={handleSubmit}>
          Book Appointment
        </Button>
      </div>
    </div>
  );
};

export default BookAppointment;
