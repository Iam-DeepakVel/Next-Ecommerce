import { createContext } from "react";
import useLocalStorageState from "use-local-storage-state";

// Create context as ProductContex
export const ProductContext = createContext({});

//Create a function and pass {children} so that the value will be available to all components
export default function ProductsContextProvider({ children }) {
  // Using a external package named 'use-local-storage-state' to maintain the state in local storage and prevent loss of data while reloading the page!!!
  const [selectedProducts, setSelectedProducts] = useLocalStorageState("cart", {
    defaultValue: [],
  });

  return (
    // Provide value that u need to use in all other components
    <ProductContext.Provider value={{ selectedProducts, setSelectedProducts }}>
      {children}
    </ProductContext.Provider>
  );
}
