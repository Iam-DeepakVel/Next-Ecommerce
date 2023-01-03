import { useState } from "react";
import Layout from "../components/Layout";
import SingleProduct from "../components/SingleProduct";
import { handle } from "../db/mongoose";
import Product from "../models/Product";
import Head from 'next/head'

//Products coming from getServerSideProps() Function
export default function Home({ products }) {
  const [phrase, setPhrase] = useState("");

  //removing duplicates and changing object into array - Getting category names
  const categoriesNames = [
    ...new Set(
      products.map((p) => {
        return p.category;
      })
    ),
  ];

  //Search Functionality
  if (phrase) {
    products = products.filter((p) => p.name.toLowerCase().includes(phrase));
  }

  return (
   
    <Layout>
     <Head>
      <title>Next Ecommerce</title>
     </Head>
      <div className="flex">
        {/* Search Box */}
        <input
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
          type="text"
          placeholder="Search for products..."
          className="bg-gray-100 w-1/2 mx-auto py-2 px-4 rounded-xl"
        />
      </div>
      
      <div>
        {categoriesNames.map((categoryName) => (
          <div key={categoryName}>
            {products.find((p) => p.category === categoryName) && (
              <div>
                <h2 className="text-3xl uppercase font-bold">{categoryName}</h2>
                <div className="flex space-x-8 my-4 overflow-x-scroll snap-x scrollbar-hide">
                  {/* Filtering categorywise items and mapping each item!! */}
                  {products
                    .filter((p) => p.category === categoryName)
                    .map((product) => (
                      <div key={product._id} className="snap-start">
                        <SingleProduct {...product} />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

    </Layout>
  );
}

//Rendering in Server Side Rendering - Fetching products with getServerSideProps
export async function getServerSideProps(){
  //Connecting to mongodb database
  await handle();
  
  //Getting Products from mongodb database 
  const products = await Product.find().exec();
  
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
