import React, { useState, useEffect, useContext } from 'react';
import './doctorlist.css';
import BookAppointment from './BookAppointment';
import DoctorDetails from './DoctorDetails';
import { getDoctors } from '../../util/fetch';
import useService from "../../common/hooks/useService";
import Rating from '@mui/material/Rating';
import { Box, Button } from '@mui/material';


const DoctorList = () => {
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [showBookAppointment, setShowBookAppointment] = useState(false);
  const [showViewDetails, setShowViewDetails] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const { ServicesCtx } = useService();
	const { showMessage } = useContext(ServicesCtx);

  useEffect(() => {
    getDoctors()
      .then((json) => {
        setDoctors(json);
      })
      .catch((json) => {
        showMessage(json.reason, "error");
      });
  }, []);

  const handleSpecialityChange = (event) => {
    setSelectedSpeciality(event.target.value);
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookAppointment(true);
  };

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setShowViewDetails(true);
  };

  const filteredDoctors = selectedSpeciality
    ? doctors.filter((doctor) => doctor.speciality === selectedSpeciality)
    : doctors;

  return (
    <div className="doctor-list-container">
      <h6 className="speciality-heading">Select Speciality</h6>
      <select value={selectedSpeciality} onChange={handleSpecialityChange} className="speciality-select">
        <option value=""></option>
        <option value="CARDIOLOGIST">CARDIOLOGIST</option>
        <option value="DENTIST">DENTIST</option>
        <option value="GENERAL_PHYSICIAN">GENERAL_PHYSICIAN</option>
        <option value="PULMONOLOGIST">PULMONOLOGIST</option>
        <option value="ENT">ENT</option>
        <option value="GASTRO">	GASTRO</option>
      </select>

      {filteredDoctors.length > 0 && (
        <div>
          {filteredDoctors.map((doctor, index) => (
            <Box className="doctor-box" key={index} sx={(theme) => ({boxShadow: 1, borderRadius: 1})}>
              <h5 className="doctor-name">Name : {doctor.firstName + " " + doctor.lastName}</h5>
              <h5 className="speciality">Speciality : {doctor.speciality}</h5>
              <h5 className="rating">Rating : <Rating value={doctor.rating} readOnly /></h5>
              <div className="button-container">
                <Button color='primary' variant='contained' size="small" className="book-appointment" onClick={() => handleBookAppointment(doctor)}>
                  Book Appointment
                </Button>
                <Button color='primary' variant='contained' size="small" className="view-details" onClick={() => handleViewDetails(doctor)}>
                  View Details
                </Button>
              </div>
            </Box>
          ))}
        </div>
      )}

      {showBookAppointment && selectedDoctor && (
        <div>
          <h2>Book Appointment Component</h2>
          <BookAppointment doctor={selectedDoctor} />
        </div>
      )}

      {showViewDetails && selectedDoctor && (
        <div>
          <h2>Doctor Details</h2>
          <DoctorDetails doctor={selectedDoctor} />
        </div>
      )}
    </div>
  );
};

export default DoctorList;
