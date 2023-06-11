import { createContext, useContext } from "react";

interface AppContextType {}

const AppContext = createContext<AppContextType>({});

interface AppContextProviderProps {
	children: React.ReactNode;
}
const AppProvider: React.FC<AppContextProviderProps> = ({ children }) => {
	return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);

export default AppProvider;
