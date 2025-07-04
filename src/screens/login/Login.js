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
import "./Login.css";
import { FormControl, TextField, Button } from "@mui/material";

const Login = () => {

	let initialState = {
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
			errorMessage: null
		},
	};

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setUsernameError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [loginError, setLoginError] = useState("");

	const [formData, setFormData] = useState(initialState);
	const [busy, setBusy] = useState(false);
	const { AuthCtx } = useAuth();
	const { login, loggedInUser } = useContext(AuthCtx);
	const history = useNavigate();
	const location = useLocation();
	const { from } = (location && location.state) || { from: { pathname: "/" } };
	const { ServicesCtx } = useService();
	const { showMessage } = useContext(ServicesCtx);

	useEffect(() => {
		loggedInUser && history(from, { replace: true });
	}, [loggedInUser, from, history]);

	let validateAndLoginData = () => {
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
			login(requestJson.username, requestJson.password).then(() => {
				showMessage("Login successful", "success");
				setBusy(false);
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

	let validateAndSaveLoginData = (fieldName, fieldValue) => {
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
		<FormControl className="login-container-5">
			<div className="input-container-5">
				<TextField id="username"
					label="Email *"
					variant="standard"
					fullWidth
					type="email"
					value={formData.username.value}
					onChange={(event) => saveOnFieldChange("username", event.target.value)}
					onBlur={(event) => validateAndSaveLoginData("username", event.target.value)}
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
					onBlur={(event) => validateAndSaveLoginData("password", event.target.value)}
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
				{loginError !== "" && <p className="error-message-1">{loginError}</p>}
			</div>
			<div className="login-button-container-5">
				<Button color="primary" variant="contained" size="small" onClick={validateAndLoginData}>
					LOGIN
				</Button>
			</div>
		</FormControl>
	);
};

export default Login;