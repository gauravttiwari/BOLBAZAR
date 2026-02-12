const { useRouter } = require("next/navigation");
const { createContext, useState, useContext, useEffect } = require("react");

const SellerContext = createContext();

export const SellerProvider = ({children}) => {
  const router = useRouter();

  // Initialize state without accessing sessionStorage
  const [currentSeller, setCurrentSeller] = useState(null);
  const [sellerLoggedIn, setSellerLoggedIn] = useState(false);
  const [sellerReady, setSellerReady] = useState(false);

  // Load seller from sessionStorage only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sellerData = sessionStorage.getItem("seller");
      console.log("🔍 SellerContext: Loading seller from sessionStorage:", sellerData);
      if (sellerData) {
        try {
          const parsedData = JSON.parse(sellerData);
          // Handle both old format { message, token, seller: {...} } and new format { _id, fname, ... }
          const seller = parsedData.seller || parsedData;
          console.log("✅ SellerContext: Parsed seller data:", seller);
          setCurrentSeller(seller);
          setSellerLoggedIn(seller !== null && seller._id);
        } catch (error) {
          console.error("❌ SellerContext: Error parsing seller data:", error);
          setCurrentSeller(null);
          setSellerLoggedIn(false);
        }
      }
      setSellerReady(true);
      console.log("🎯 SellerContext: Ready state set to true");
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
        sellerReady,
        logout,
      }}
    >
      {children}
    </SellerContext.Provider>
  );
};


const useSellerContext = () => useContext(SellerContext);
export default useSellerContext;