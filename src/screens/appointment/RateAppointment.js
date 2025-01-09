import React, { useState, useContext } from "react";
import Rating from '@mui/material/Rating';
import { doRateAppointment } from "../../util/fetch";
import useService from "../../common/hooks/useService";
import useAuth from "../../common/hooks/useAuth";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

const RateAppointment = ({ appointment }) => {
  const [rating, setRating] = useState({
    comments: "",
    rating: 0,
    appointmentId: appointment.appointmentId,
    doctorId: appointment.doctorId
  });
  const { AuthCtx } = useAuth();
  const { accessToken } = useContext(AuthCtx);
  const { ServicesCtx } = useService();
  const { showMessage } = useContext(ServicesCtx);

  const handleInputChange = (event) => {
    let { name, value } = event.target;
    value = name == "rating"? Number(value): value;
    setRating((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    doRateAppointment(accessToken, rating)
      .then((json) => {
        showMessage("Rating successfully submited");
      })
      .catch((json) => {
        showMessage(json.reason, "error");
      });
  };

  return (
    <div className="modal-overlay">
      <div className="rate-appointment-modal">
        <div className="modal-header">
          <h2>Rate an Appointment</h2>
        </div>
        <div className="modal-content">
          <div>
            <TextField id="comments" name="comments" variant="standard" label="Comments" rows={4} multiline value={rating.comments} onChange={handleInputChange}></TextField>
          </div>
          <div>
            <label htmlFor="comments">
              Rating: <Rating id="rating" name="rating" value={rating.rating} onChange={handleInputChange} />
            </label>
          </div>
          <Button color='primary' variant='contained' size="small" className="rate-appointment" onClick={handleSubmit}>RATE APPOINTMENT</Button>
        </div>
      </div>
    </div>
  );
};

export default RateAppointment;
