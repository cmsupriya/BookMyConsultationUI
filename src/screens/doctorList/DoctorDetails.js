import React, { useState, useEffect, useContext } from "react";
import "./doctordetails.css";
import { getDoctor } from '../../util/fetch';
import useService from "../../common/hooks/useService";
import Rating from '@mui/material/Rating';

const DoctorDetails = ({ doctor }) => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const { ServicesCtx } = useService();
  const { showMessage } = useContext(ServicesCtx);

  useEffect(() => {
    getDoctor(doctor.id)
      .then((json) => {
        setDoctorDetails(json);
      })
      .catch((json) => {
        showMessage(json.reason, "error");
      });
  }, [doctor]);

  return (
    <div className="modal-overlay">
      <div className="doctor-details-modal">
        <div className="modal-header">
          <h2>Doctor Details</h2>
        </div>
        {doctorDetails && (
          <div className="modal-content">
            <h3>Dr. {doctorDetails.firstName + " " + doctorDetails.lastName}</h3>
            <h5>Total Experience: {doctorDetails.totalYearsOfExp}</h5>
            <h5>Speciality: {doctorDetails.speciality}</h5>
            <h5>Date of Birth: {doctorDetails.dob}</h5>
            <h5>City: {doctorDetails.address.city}</h5>
            <h5>Email: {doctorDetails.emailId}</h5>
            <h5>Mobile: {doctorDetails.mobile}</h5>
            <h5>Rating: <Rating value={doctorDetails.rating} readOnly /></h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDetails;
