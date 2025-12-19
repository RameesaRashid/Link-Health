import mongoose from "mongoose";

// const MONGO_URI: string | undefined = process.env.MONGO_URI;

const connectDB = async (): Promise<void> => {

    const MONGO_URI: string | undefined = process.env.MONGO_URI;
    if (!MONGO_URI) {
        console.error("MONGO_URI is not defined in environment variables.");
        process.exit(1);
    }
    try{
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected successfully! Host: ${conn.connection.host} `);
        
    }
    catch(err){
        console.error(`Error connecting to MongoDB: ${(err as Error).message}`);
        process.exit(1);
    }
};

export default connectDB;