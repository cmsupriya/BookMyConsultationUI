import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Controller from "./screens/Controller";
import useAuth from './common/hooks/useAuth';
import useService from './common/hooks/useService';

const Index = () => {

	const {AuthProvider} = useAuth();
	const {ServicesProvider} = useService();

	return (
		<AuthProvider>
			<ServicesProvider>
				<Controller />
			</ServicesProvider>
		</AuthProvider>
	);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<Index />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
