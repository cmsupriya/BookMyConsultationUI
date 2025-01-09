import {createContext, useState} from "react";

const ServicesCtx = createContext();

const useService = () => {

	const [message, setMessage] = useState(null);
	const [level, setLevel] = useState(null);

	const showMessage = (messageBroadcast, messageLevel) => {
		setMessage(messageBroadcast);
		setLevel(messageLevel);
	};

	return {
		ServicesCtx,
		ServicesProvider: ({ children }) => (
			<ServicesCtx.Provider value={{ message, level, showMessage }}>
				{children}
			</ServicesCtx.Provider>
		)
	};
};

export default useService;