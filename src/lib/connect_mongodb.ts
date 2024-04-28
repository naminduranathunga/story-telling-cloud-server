import mongoose from "mongoose";

export default async function ConnectMongoDB() {
    const db_url = process.env.DB_URL 
    if (!db_url) {
        throw new Error("DB_URL not found in .env file");
    }
    await mongoose.connect(db_url); // throws an error if connection fails 
}