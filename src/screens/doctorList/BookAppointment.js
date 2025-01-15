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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LanguageIcon from '@mui/icons-material/Language';
import { useNavigate, useLocation } from "react-router-dom";

const BookAppointment = ({ doctor }) => {

  const { AuthCtx } = useAuth();
  const { accessToken, loggedInUser, loggedInUserId, loggedInUserName } = useContext(AuthCtx);
  const { ServicesCtx } = useService();
  const { showMessage } = useContext(ServicesCtx);
	const host = useState(window.location.host);

  const [timeSlots, setTimeSlots] = useState([]);
  const [appointment, setAppointment] = useState({
    appointmentDate: dayjs(new Date()),
    timeSlot: "None",
    priorMedicalHistory: "",
    symptoms: "",
    doctorId: doctor.id,
    doctorName: doctor.firstName + " " + doctor.lastName,
    userId: loggedInUser,
    userName: loggedInUserName,
    userEmailId: loggedInUserId
  });
  const [errorState, setErrorState] = useState({
    timeSlot: {
      error: false,
      errorMessage: null
    },
  });
  const [errorDialog, setErrorDialog] = useState({
    timeSlot: {
      error: false,
      errorMessage: null
    },
  });
  const [showErrorDialog, setShowErrorDialog] = useState(false);

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
      //appointmentData = {"appointmentDate":"2025-01-15","timeSlot":"08PM-09PM","priorMedicalHistory":"","symptoms":"","doctorId":"0ac29ab8-5943-4086-aaa9-44602d7cd73e","doctorName":"Sugandra Sahoo","userId":"cm.supriya@gmail.com","userName":"Supriya Sahoo","userEmailId":"cm.supriya@gmail.com"};
      doBookAppointment(accessToken, appointmentData)
        .then((json) => {
          showMessage("Appointment booked successfully!");
        })
        .catch((json) => {
          setErrorDialog({ timeSlot: { error: true, errorMessage: json.reason }});
          setShowErrorDialog(true)
        });
  }
};

const handleClose = () => {
  setErrorDialog({ timeSlot: { error: false, errorMessage: null }});
  setShowErrorDialog(false);
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

    {showErrorDialog &&
      <React.Fragment>
        <Dialog open={showErrorDialog} onClose={handleClose} aria-labelledby="error-dialog-title" className="error-dialog">
          <DialogTitle sx={{ m: 0, p: 2 }} id="error-dialog-title" className="dialog-title">
            <LanguageIcon></LanguageIcon>
            <label>{host}</label>
          </DialogTitle>
          <DialogContent className="dialog-content">
            {errorDialog.timeSlot.error && errorDialog.timeSlot.errorMessage}
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button variant="contained" color="info" size="small" autoFocus onClick={handleClose}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    }
  </div>
);
};

export default BookAppointment;
