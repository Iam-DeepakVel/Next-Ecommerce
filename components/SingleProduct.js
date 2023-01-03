import Image from "next/image";
import { ProductContext } from "./ProductContext";
import { useContext } from "react";

export default function SingleProduct({_id, name, price, description, picture }) {
  
  const {setSelectedProducts} = useContext(ProductContext);
   
  const addProduct = ()=>{
    setSelectedProducts((prev)=>[...prev,_id])
  }


  return (
    <div className="w-64">
      <div className="bg-blue-100 p-5 rounded-xl">
        <Image src={picture} width={500} height={500} alt="iphone14 pro" />
      </div>
      <div className="mt-2">
        <h3 className="font-bold text-lg">{name}</h3>
      </div>
      <p className="text-sm mt-2 text-gray-500 leading-4">{description}</p>
      <div className="flex mt-2">
        <h2 className="text-2xl font-bold grow">₹{price}</h2>
        <button onClick={addProduct} className="bg-emerald-400 text-white py-2 px-3 rounded-xl ">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
