import mongoose from "mongoose";

export async function handle(){
    mongoose.set('strictQuery', false);
    return await mongoose.connect(process.env.MONGO_URI)
}