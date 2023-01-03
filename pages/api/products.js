import { handle } from "../../db/mongoose";
import Product from "../../models/Product";

export default async function prod(req, res) {
  // Connecting with mongodb atlas database with help of mongoose
  await handle();
  
  const {ids} = req.query;
  if(ids){
    //Spliting the ids comming from request and storing as array in idsArray
    const idsArray = ids.split(',')
    
    //Geting only ids that present in idsArray - For Cart Functionality
    res.json(
      await Product.find({
        '_id':{$in:idsArray}
      }).exec()
    )

  }else{
    // Geting products from mongodb atlas database
    res.json(await Product.find().exec());
  }
  
  
  
  
  
}
