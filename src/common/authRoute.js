import useAuth from "../common/hooks/useAuth";
import {useContext} from "react";
import Login from "../screens/login/Login";
import {Navigate} from "react-router-dom";

const AuthRoute = ({ role, children }) => {

	const {AuthCtx} = useAuth();
	const {loggedInUser, hasRole} = useContext(AuthCtx);

	let page = <Login />;

	if(loggedInUser !== null) {
		page = hasRole(role)? children: <Navigate to={""} />;
	}
	
	return page;
};

export default AuthRoute;