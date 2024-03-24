import mongoose from "mongoose";

async function connectToDatabase(dbUrl: string) {
    await mongoose.connect(dbUrl);
}

export { connectToDatabase };
