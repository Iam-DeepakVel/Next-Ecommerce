import Footer from "./Footer";
import { useContext,useState,useEffect } from "react";
import { ProductContext } from "./ProductContext";

export default function Layout({ children }) {
  const { setSelectedProducts } = useContext(ProductContext);

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    return () => {
      if (window.location.href.includes("success")) {
        setSelectedProducts([]);
        setSuccess(true);
      }
    };
  }, []);

  return (
    <div>
      <div className="p-5">
        {success && (
          <div className="mb-5 bg-green-500 text-white text-lg p-5 rounded-xl">Thanks you for your Order!!</div>
        )}

        {children}
      </div>
      <Footer />
    </div>
  );
}
