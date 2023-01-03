import Layout from "../components/Layout";
import { ProductContext } from "../components/ProductContext";
import { useContext, useState, useEffect } from "react";
import Image from "next/image";

// Here we dont use getServerSideProps() since the cart is not static for all users..It will be different for different users..So we need not to render already the content in server!!!

const Checkout = () => {
  const { selectedProducts, setSelectedProducts } = useContext(ProductContext);

  //ProductInfo contains data of products in cart
  const [productsInCart, SetProductsInCart] = useState([]);

  //Address
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");

  // Sending only uniqueIds to the endPoint to fetch those products
  useEffect(() => {
    //Picking only unique id
    const uniqueIds = [...new Set(selectedProducts)];
    fetch("/api/products?ids=" + uniqueIds.join(","))
      .then((res) => res.json())
      .then((json) => SetProductsInCart(json));
  }, [selectedProducts]);

  // Adding product instances
  const addMoreProduct = (id) => {
    setSelectedProducts((prev) => [...prev, id]);
  };

  // Removing one instance from cart
  //So first identify location of that single id
  //Using filter return array except the particular id
  const removeProduct = (id) => {
    const pos = selectedProducts.indexOf(id);
    if (pos !== -1) {
      // prev refers to previous values in cart
      setSelectedProducts((prev) => {
        return prev.filter((value, index) => index !== pos);
      });
    }
  };

  // Calculating SubTotal
  let subtotal = 0;
  if (selectedProducts?.length) {
    for (let id of selectedProducts) {
      const price = productsInCart.find((p) => p._id == id)?.price || 0;
      console.log("Products", productsInCart);
      console.log("Products Price", price);
      subtotal += price;
    }
  }

  //Delivery price
  let deliveryCharge;
  deliveryCharge = subtotal === 0 ? 0 : 12;

  //Total
  const total = deliveryCharge + subtotal;

  return (
    <Layout>
      {!productsInCart.length && <div>No products in your shopping cart</div>}

      {productsInCart.length &&
        productsInCart.map((product) => {
          {
            /* this block tells If selectedproducts are zero then dont show such products in checkout page */
            /* Amount variable has quantity of each product */
          }
          const amount = selectedProducts.filter(
            (id) => id === product._id
          ).length;
          if (amount === 0) return;
          {
            /* block end */
          }
          return (
            <div className="flex mb-5" key={product._id}>
              <div className="bg-gray-100 h-24 w-24 p-3 rounded-xl shrink-0">
                <Image
                  className="w-24"
                  src={product.picture}
                  width={300}
                  height={300}
                  alt={product.name}
                />
              </div>
              <div className="pl-4">
                <h3 className="font-bold text-lg"> {product.name}</h3>
                <p className="text-sm leading-4 text-gray-500">
                  {product.description}{" "}
                </p>
                <div className="flex">
                  <div className="grow">${product.price}</div>
                  <div className="flex justify-center items-center">
                    {/*Button for Remove 1 instance of product */}
                    <button
                      onClick={() => removeProduct(product._id)}
                      className=" bg-emerald-500 px-3 text-lg font-bold  rounded-lg text-white"
                    >
                      -
                    </button>

                    <span className="px-2">
                      {/* Finding quantity of each product */}
                      {
                        selectedProducts.filter((id) => id === product._id)
                          .length
                      }
                    </span>

                    {/*Button for Add 1 instance of product */}
                    <button
                      onClick={() => addMoreProduct(product._id)}
                      className=" bg-emerald-500 px-2 text-lg font-bold  rounded-lg text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div className="font-bold text-gray-700 text-xl">
          Contact Details
        </div>
      <form action="/api/checkout" method="POST">
        <div className="flex flex-col mt-4">
          <input
            name="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="bg-gray-100 w-ful rounded-lg px-4 py-2 mb-2"
            type="text"
            placeholder="Your Name"
          />
          <input
            name="address"
            onChange={(e) => setAddress(e.target.value)}
            value={address}
            className="bg-gray-100 w-ful rounded-lg px-4 py-2 mb-2"
            type="text"
            placeholder="Street address, number"
          />
          <input
            name="city"
            onChange={(e) => setCity(e.target.value)}
            value={city}
            className="bg-gray-100 w-ful rounded-lg px-4 py-2 mb-2"
            type="text"
            placeholder="City and Postal Code"
          />
          <input
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="bg-gray-100 w-ful rounded-lg px-4 py-2 mb-2"
            type="email"
            placeholder="Email Address"
          />
        </div>
        <div className="mt-4 p-3">
          <div className="flex my-3">
            <h3 className="grow font-bold text-gray-400">Subtotal:</h3>
            <h3 className="font-bold">₹{subtotal}</h3>
          </div>
          <div className="flex my-3">
            <h3 className="grow font-bold text-gray-400">Delivery Charge:</h3>
            <h3 className="font-bold">₹{deliveryCharge}</h3>
          </div>
          <div className="flex my-3 border-t-2 pt-3 border-dashed border-emerald-500">
            <h3 className="grow font-bold text-gray-400">Total:</h3>
            <h3 className="font-bold">₹{total}</h3>
          </div>
        </div>

        <div className="flex">
          {/* Passing the selectedProducts to /api/checkout end point */}
          <input
            type="hidden"
            name="products"
            value={selectedProducts.join(",")}
          />
          <button
            type="submit"
            className="bg-emerald-500 px-5 py-2 rounded-xl mx-auto font-bold w-32 shadow-emerald-400 shadow-lg"
          >
            Pay ₹{total}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default Checkout;
