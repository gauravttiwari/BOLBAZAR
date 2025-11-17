const { useRouter } = require("next/navigation");
const { createContext, useState, useContext, useEffect } = require("react");

const SellerContext = createContext();

export const SellerProvider = ({children}) => {
  const router = useRouter();

  // Initialize state without accessing sessionStorage
  const [currentSeller, setCurrentSeller] = useState(null);
  const [sellerLoggedIn, setSellerLoggedIn] = useState(false);

  // Load seller from sessionStorage only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sellerData = sessionStorage.getItem("seller");
      if (sellerData) {
        try {
          const parsedSeller = JSON.parse(sellerData);
          setCurrentSeller(parsedSeller);
          setSellerLoggedIn(parsedSeller !== null);
        } catch (error) {
          console.error("Error parsing seller data from sessionStorage:", error);
          setCurrentSeller(null);
          setSellerLoggedIn(false);
        }
      }
    }
  }, []);

  // Save seller to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentSeller) {
        sessionStorage.setItem("seller", JSON.stringify(currentSeller));
      } else {
        sessionStorage.removeItem("seller");
      }
    }
  }, [currentSeller]);

  const logout = () => {
    setCurrentSeller(null);
    setSellerLoggedIn(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem("seller");
    }
    router.push("/sellerlogin");
  };

  return (
    <SellerContext.Provider
      value={{
        currentSeller,
        setCurrentSeller,
        sellerLoggedIn,
        setSellerLoggedIn,
        logout,
      }}
    >
      {children}
    </SellerContext.Provider>
  );
};


const useSellerContext = () => useContext(SellerContext);
export default useSellerContext;