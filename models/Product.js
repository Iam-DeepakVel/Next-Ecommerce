import { model, Schema , models } from "mongoose";

const productSchema = new Schema({
  name:String,
  description:String,
  price:Number,
  Category:String,
  Picture:String
})

const Product = models?.Product || model('Product',productSchema)

export default Product