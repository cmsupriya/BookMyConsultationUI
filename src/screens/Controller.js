import React from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Home from "../screens/home/Home";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Container from '@mui/material/Container';
import { useContext, useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import Login from "./login/Login";
import Register from "../screens/register/Register";
import AuthRoute from "../common/authRoute";
import Header from "../common/header/Header";
import useAuth from '../common/hooks/useAuth';
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import useService from "../common/hooks/useService";

const theme = createTheme({
	palette: {
		primary: {
			main: '#3f51b5',
		},
		secondary: {
			main: '#f50057',
		},
		disabled: {
			main: "#56595c",
		}
	},
});

const Controller = () => {
	const { AuthCtx } = useAuth();
	const { ServicesCtx } = useService();
	const { accessToken } = useContext(AuthCtx);
	const { message, level, showMessage } = useContext(ServicesCtx);
	const [showInfo, setShowInfo] = useState(false);

	useEffect(() => {
		if (message === null || level === null) {
			setShowInfo(false);
		} else {
			setShowInfo(true);
		}
	}, [message, level]);

	let hideAndResetMessage = () => {
		setShowInfo(false);
		showMessage(null, null);
	};

	return (
		<ThemeProvider theme={theme}>
			<Router>
				<Home />
				<Snackbar
					anchorOrigin={{ vertical: "top", horizontal: "right" }}
					open={showInfo}
					autoHideDuration={4000}
					onClose={() => hideAndResetMessage()}
				>
					<Alert onClose={() => hideAndResetMessage()} severity={level} sx={{ width: '100%' }}>
						{message}
					</Alert>
				</Snackbar>
			</Router>
		</ThemeProvider>
	);
};

export default Controller;
