import Grid from "@mui/material/Grid";
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { useState, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../../common/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import useService from "../../common/hooks/useService";
import Tooltip from '@mui/material/Tooltip';
import "./register.css";
import { FormControl, TextField, Button } from "@mui/material";
import { doRegister } from "../../util/fetch";

const Register = () => {

  let initialState = {
    firstname: {
      value: "",
      error: false,
      errorCode: null,
      errorMessage: null,
    },
    lastname: {
      value: "",
      error: false,
      errorCode: null,
      errorMessage: null,
    },
    username: {
      value: "",
      error: false,
      errorCode: null,
      errorMessage: null,
    },
    password: {
      value: "",
      error: false,
      errorCode: null,
      errorMessage: "Please enter valid password.",
    },
    contactnumber: {
      value: "",
      error: false,
      errorCode: null,
      errorMessage: null,
    },
  };

  const [registerError, setRegisterError] = useState("");
  const [formData, setFormData] = useState(initialState);
  const [busy, setBusy] = useState(false);
  const { AuthCtx } = useAuth();
  const { login, loggedInUser } = useContext(AuthCtx);
  const history = useNavigate();
  const location = useLocation();
  const { from } = (location && location.state) || { from: { pathname: "/home" } };
  const { ServicesCtx } = useService();
  const { showMessage } = useContext(ServicesCtx);

  useEffect(() => {
    loggedInUser && history(from, { replace: true });
  }, [loggedInUser, from, history]);

  let validateAndRegisterData = () => {
    setBusy(true);
    let data = {
      ...formData
    };
    let requestJson = {};
    let validDetails = true;
    for (let k in formData) {
      let json = getValidity(k, formData[k].value);
      data[k] = {
        value: data[k].value,
        error: !json.valid,
        errorCode: json.code,
        errorMessage: json.message,
      };
      validDetails = validDetails && json.valid;
      if (json.valid) {
        requestJson[k] = data[k].value;
      }
    }
    setFormData(data);
    if (validDetails) {
      doRegister(requestJson.username, requestJson.password, requestJson.firstname, requestJson.lastname, requestJson.contactnumber).then(() => {
        showMessage("Registration Successful", "success");
        login(requestJson.username, requestJson.password).then(() => {
          setBusy(false);
        }).catch(json => {
          setBusy(false);
        });
      }).catch(json => {
        showMessage(json.reason, "error");
        setBusy(false);
      });
    } else {
      setBusy(false);
    }
  };

  let matchRegex = (value, re) => {
    let regex = new RegExp(re);
    return regex.test(value);
  }

  let getValidity = (field, value) => {
    let valid = true;
    let code = null;
    let message = null;
    if (value == null || value.length === 0) {
      valid = false;
      code = 1;
      message = "Please fill out this field";
    } else {
      switch (field) {
        case "firstname": {
          if (value.length > 255) {
            valid = false;
            code = 2;
            message = "First name can be of length 255 characters";
          } else {
            valid = matchRegex(value, "^([A-Za-z]+)$");
            code = 2;
            message = "Enter valid First Name";
          }
          break;
        }
        case "lastname": {
          if (value.length > 255) {
            valid = false;
            code = 2;
            message = "Last name can be of length 255 characters";
          } else {
            valid = matchRegex(value, "^([A-Za-z]+)$");
            code = 2;
            message = "Enter valid Last Name";
          }
          break;
        }
        case "username": {
          if (value.length > 255) {
            valid = false;
            code = 2;
            message = "Email can be of length 255 characters";
          } else {
            valid = matchRegex(value, "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$");
            code = 2;
            message = "Enter valid Email";
          }
          break;
        }
        case "password": {
          if (value.length < 6 || 40 < value.length) {
            valid = false;
            code = 2;
            message = "Password's length must be between 6 and 40"
          }
          break;
        }
        case "contactnumber": {
          valid = matchRegex(value, "^([0-9]{10})$");
          message = "Enter valid mobile number";
          code = 2;
          break;
        }
        default: {
          return;
        }
      }
    }
    return {
      valid,
      code,
      message
    };
  };

  let validateAndSaveRegisterData = (fieldName, fieldValue) => {
    let json = getValidity(fieldName, fieldValue);
    let data = {
      ...formData
    };
    data[fieldName] = {
      value: data[fieldName].value,
      error: !json.valid,
      errorCode: json.code,
      errorMessage: json.message,
    }
    setFormData(data);
  };

  let saveOnFieldChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        value
      }
    });
  };

  return (
    <FormControl className="register-container-5">
      <div className="input-container-5">
        <TextField id="firstname"
          label="First Name *"
          variant="standard"
          value={formData.firstname.value}
          onChange={(event) => saveOnFieldChange("firstname", event.target.value)}
          onBlur={(event) => validateAndSaveRegisterData("firstname", event.target.value)}
          error={formData.firstname.error}
          helperText={formData.firstname.error && formData.firstname.errorCode === 2 && formData.firstname.errorMessage}
        />
        {formData.firstname.error && formData.firstname.errorCode === 1 &&
          <div className='tooltip-required-validation'>
            <Tooltip placement="bottom-start">
              <label>{formData.firstname.errorMessage}</label>
            </Tooltip>
          </div>
        }
      </div>
      <div className="input-container-5">
        <TextField id="lastname"
          label="Last Name *"
          variant="standard"
          value={formData.lastname.value}
          onChange={(event) => saveOnFieldChange("lastname", event.target.value)}
          onBlur={(event) => validateAndSaveRegisterData("lastname", event.target.value)}
          error={formData.lastname.error}
          helperText={formData.lastname.error && formData.lastname.errorCode === 2 && formData.lastname.errorMessage}
        />
        {formData.lastname.error && formData.lastname.errorCode === 1 &&
          <div className='tooltip-required-validation'>
            <Tooltip placement="bottom-start">
              <label>{formData.lastname.errorMessage}</label>
            </Tooltip>
          </div>
        }
      </div>
      <div className="input-container-5">
        <TextField id="username"
          label="Email Id *"
          variant="standard"
          fullWidth
          type="email"
          value={formData.username.value}
          onChange={(event) => saveOnFieldChange("username", event.target.value)}
          onBlur={(event) => validateAndSaveRegisterData("username", event.target.value)}
          error={formData.username.error}
          helperText={formData.username.error && formData.username.errorCode === 2 && formData.username.errorMessage}
        />
        {formData.username.error && formData.username.errorCode === 1 &&
          <div className='tooltip-required-validation'>
            <Tooltip placement="bottom-start">
              <label>{formData.username.errorMessage}</label>
            </Tooltip>
          </div>
        }
      </div>
      <div className="input-container-5">
        <TextField id="password"
          label="Password *"
          variant="standard"
          fullWidth
          type="password"
          value={formData.password.value}
          onChange={(event) => saveOnFieldChange("password", event.target.value)}
          onBlur={(event) => validateAndSaveRegisterData("password", event.target.value)}
          error={formData.password.error}
          helperText={formData.password.error && formData.password.errorCode === 2 && formData.password.errorMessage}
        />
        {formData.password.error && formData.password.errorCode === 1 &&
          <div className='tooltip-required-validation'>
            <Tooltip placement="bottom-start">
              <label>{formData.password.errorMessage}</label>
            </Tooltip>
          </div>
        }
      </div>
      <div className="input-container-5">
        <TextField id="contactnumber"
          label="Mobile No. *"
          variant="standard"
          value={formData.contactnumber.value}
          onChange={(event) => saveOnFieldChange("contactnumber", event.target.value)}
          onBlur={(event) => validateAndSaveRegisterData("contactnumber", event.target.value)}
          error={formData.contactnumber.error}
          helperText={formData.contactnumber.error && formData.contactnumber.errorCode === 2 && formData.contactnumber.errorMessage}
        />
        {formData.contactnumber.error && formData.contactnumber.errorCode === 1 &&
          <div className='tooltip-required-validation'>
            <Tooltip placement="bottom-start">
              <label>{formData.contactnumber.errorMessage}</label>
            </Tooltip>
          </div>
        }
        {registerError !== "" && <p className="error-message-1">{registerError}</p>}
      </div>
      <div className="register-button-container-5">
        <Button color="primary" variant="contained" size="small" onClick={validateAndRegisterData}>
          REGISTER
        </Button>
      </div>
    </FormControl>
  );
};

export default Register;