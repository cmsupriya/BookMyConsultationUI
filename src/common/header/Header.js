import React, { useContext, useState } from "react";
import { Button, Box, Modal } from "@mui/material";
import "./Header.css";
import LoginModal from "../../screens/login/Login";
import RegisterModal from "../../screens/register/Register";
import logo from '../../assets/logo.jpeg';
import useAuth from '../hooks/useAuth';
import useService from "../hooks/useService";

const Header = () => {
  const { AuthCtx } = useAuth();
  const { accessToken, logout, loggedInUser, hasRole } = useContext(AuthCtx);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const { ServicesCtx } = useService();
  const { showMessage } = useContext(ServicesCtx);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  const handleLoginClick = () => {
    handleTabChange(0);
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  };

  const handleRegisterClick = () => {
    handleTabChange(1);
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const handleClose = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  const doLogout = () => {
    logout(accessToken).then(() => {
      showMessage("Logout successful", "success");
      setBusy(false);
    }).catch(json => {
      showMessage(json.reason, "error");
      setBusy(false);
    });
  }

  return (
    <div className="header-header">
      <div className="header-logo">
        <img src={logo} alt="Logo" />
        <span className="header-logo-text">Doctor Finder</span>
      </div>
      <div className="header-login-logout">
        {
          loggedInUser == null &&
          <Button variant="contained" color="primary" onClick={handleLoginClick} size="small">
            Login
          </Button>
        }
        {
          loggedInUser != null &&
          <Button variant="contained" color="secondary" onClick={() => doLogout()} size="small">
            LOGOUT
          </Button>
        }
      </div>
      {(isLoginModalOpen || isRegisterModalOpen) && (
        <Modal
          open={isLoginModalOpen || isRegisterModalOpen}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
          <Box className="modal-overlay">
            <div className="header-auth-modal">
              <div className="modal-header">
                <h2>Authentication</h2>
              </div>
              <div className="header-auth-options">
                <button className={activeTab === 0 ? 'active' : ''} onClick={handleLoginClick}>Login</button>
                <button className={activeTab === 1 ? 'active' : ''} onClick={handleRegisterClick}>Register</button>
              </div>
              {isLoginModalOpen && <LoginModal />}
              {isRegisterModalOpen && <RegisterModal />}
            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default Header;
