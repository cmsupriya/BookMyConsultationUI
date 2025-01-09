import React, { useState, useContext } from 'react';
import './register.css';
import { doRegister } from "../../util/fetch";
import useService from "../../common/hooks/useService";
import { FormControl, TextField, Button } from "@mui/material";

const UniqueHeader = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [registerErrors, setRegisterErrors] = useState('');
  const [busy, setBusy] = useState(false);
  const { ServicesCtx } = useService();
	const { showMessage } = useContext(ServicesCtx);

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
    setRegisterErrors('');
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
    setRegisterErrors('');
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setRegisterErrors('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setRegisterErrors('');
  };

  const handleContactNumberChange = (event) => {
    setContactNumber(event.target.value);
    setRegisterErrors('');
  };

  const handleRegister = () => {
    if (!firstName || !lastName || !email || !password || !contactNumber) {
      setRegisterErrors('Please fill out all the fields');
      return;
    }

    doRegister(email, password, firstName, lastName, contactNumber)
      .then((json) => {
        showMessage("Registration successful", "success");
        setBusy(false);
      })
      .catch((json) => {
        showMessage(json.reason, "error");
        setBusy(false);
      });
  };

  return (
    <>
      {activeTab === 0 && (
        <div className="unique-tab-content">
          <div className="unique-input-container">
            <div className="unique-input">
              <label htmlFor="firstName" className="unique-label">
                First Name
              </label>
              <input
                id="firstName"
                value={firstName}
                onChange={handleFirstNameChange}
              />
              <label htmlFor="lastName" className="unique-label">
                Last Name
              </label>
              <input
                id="lastName"
                value={lastName}
                onChange={handleLastNameChange}
              />
              <label htmlFor="email" className="unique-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
              />
              <label htmlFor="password" className="unique-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
              <label htmlFor="contactNumber" className="unique-label">
                Contact Number
              </label>
              <input
                id="contactNumber"
                value={contactNumber}
                onChange={handleContactNumberChange}
              />
              <div className="unique-login-button-container">
                <Button color="primary" variant="contained" size="small" onClick={handleRegister}>
                  REGISTER
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {registerErrors && (
        <div className="unique-floating-error-box">
          <div className="unique-error-message">{registerErrors}</div>
        </div>
      )}
    </>
  );
};

export default UniqueHeader;
