import { createContext, useState } from "react";
import { doLogin, doLogout} from "../../util/fetch";

const AuthCtx = createContext();

const useAuth = () => {

	let initialState = localStorage.getItem("logged_in_user_details");

	let persistInCache = (json) => {
		initialState.user = json.username;
		initialState.userId = json.userId;
		initialState.userName = json.firstName + " " + json.lastName;
		initialState.roles = json.roles;
		initialState.accessToken = json.accessToken;
		initialState.accessTokenTimeout = json.accessTokenTimeout;
		localStorage.setItem("logged_in_user_details", JSON.stringify(initialState));
	};

	let clearCache = () => {
		initialState = {
			user: null,
			userId: null,
			userName:null,
			roles: null,
			accessToken: null,
			accessTokenTimeout: null,
		};
		localStorage.setItem("logged_in_user_details", JSON.stringify(initialState));
	};

	if (initialState === null || initialState === undefined) {
		initialState = {
			user: null,
			userId: null,
			userName:null,
			roles: null,
			accessToken: null,
			accessTokenTimeout: null,
		};
	} else {
		initialState = JSON.parse(initialState);
		if (initialState.accessTokenTimeout !== null && initialState.accessTokenTimeout < Date.now()) {
			clearCache();
		}
	}

	const [loggedInUser, setLoggedInUser] = useState(initialState.user);
	const [loggedInUserId, setLoggedInUserId] = useState(initialState.userId);
	const [loggedInUserName, setLoggedInUserName] = useState(initialState.userName);
	const [roles, setRoles] = useState(initialState.roles);
	const [accessToken, setAccessToken] = useState(initialState.accessToken);
	const [accessTokenTimeout, setAccessTokenTimeout] = useState(initialState.accessTokenTimeout);
	const [loginError, setLoginError] = useState(null);

	const login = (email, password) => {
		let promiseResolveRef = null;
		let promiseRejectRef = null;
		let promise = new Promise((resolve, reject) => {
			promiseResolveRef = resolve;
			promiseRejectRef = reject;
		});
		doLogin(email, password).then(json => {
			setLoggedInUser(json.username);
			setLoggedInUserId(json.userId);
			setLoggedInUserName(json.firstName + " " + json.lastName);
			setRoles(json.roles);
			setAccessToken(json.accessToken);
			setAccessTokenTimeout(json.accessTokenTimeout);
			setLoginError(null);
			persistInCache(json);
			promiseResolveRef(json);
		}).catch(json => {
			setLoggedInUser(null);
			setLoggedInUserId(null);
			setLoggedInUserName(null);
			setRoles(null);
			setAccessToken(null);
			setAccessTokenTimeout(null);
			setLoginError(json.reason);
			promiseRejectRef(json);
		});
		return promise;
	};

	const logout = (accessToken) => {
		let promiseResolveRef = null;
		let promiseRejectRef = null;
		let promise = new Promise((resolve, reject) => {
			promiseResolveRef = resolve;
			promiseRejectRef = reject;
		});
		doLogout(accessToken).then(json => {
			setLoggedInUser(null);
			setLoggedInUserId(null);
			setLoggedInUserName(null);
			setRoles(null);
			setAccessToken(null);
			setAccessTokenTimeout(null);
			setLoginError(null);
			clearCache();
			promiseResolveRef(json);
		}).catch(json => {
			setLoggedInUser(null);
			setLoggedInUserId(null);
			setLoggedInUserName(null);
			setRoles(null);
			setAccessToken(null);
			setAccessTokenTimeout(null);
			setLoginError(json.reason);
			promiseRejectRef(json);
		});
		return promise;
	};

	const hasRole = (roleArray) => {
		if (roleArray === undefined || roleArray === null) {
			return true;
		}
		if (initialState.roles !== null) {
			for (let i = 0; i < initialState.roles.length; i++) {
				for (let j = 0; j < roleArray.length; j++) {
					if (initialState.roles[i] === roleArray[j]) {
						return true;
					}
				}
			}
		}
		return false;
	};

	const isAccessTokenValid = () => {
		return !(accessTokenTimeout !== null && accessTokenTimeout < Date.now());
	};

	return {
		AuthCtx,
		AuthProvider: ({ children }) => (
			<AuthCtx.Provider value={{ loginError, loggedInUser, loggedInUserId, loggedInUserName, accessToken, accessTokenTimeout, roles, login, logout, hasRole, isAccessTokenValid }}>
				{children}
			</AuthCtx.Provider>
		)
	};
};

export default useAuth;