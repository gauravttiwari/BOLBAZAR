const { useRouter } = require("next/navigation");
const { createContext, useState, useContext, useEffect } = require("react");

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const router = useRouter();

  // Initialize state without accessing sessionStorage
  const [currentUser, setCurrentUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  // Load user from sessionStorage only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setCurrentUser(parsedUser);
          setLoggedIn(parsedUser !== null);
        } catch (error) {
          console.error("Error parsing user data from sessionStorage:", error);
          setCurrentUser(null);
          setLoggedIn(false);
        }
      }
    }
  }, []);

  // Save user to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentUser) {
        sessionStorage.setItem("user", JSON.stringify(currentUser));
      } else {
        sessionStorage.removeItem("user");
      }
    }
  }, [currentUser]);

  const logout = () => {
    setCurrentUser(null);
    setLoggedIn(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem("user");
    }
    router.push("/login");
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loggedIn,
        setLoggedIn,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};


const useAppContext = () => useContext(AppContext);
export default useAppContext;