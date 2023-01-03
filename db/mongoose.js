import mongoose from "mongoose";

export async function handle(){
    return await mongoose.connect(process.env.MONGO_URI)
}