import mongoose from "mongoose";
// const MONGO_URI: string | undefined = process.env.MONGO_URI;
const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
        console.error("MONGO_URI is not defined in environment variables.");
        process.exit(1);
    }
    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected successfully! Host: ${conn.connection.host} `);
    }
    catch (err) {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1);
    }
};
export default connectDB;
//# sourceMappingURL=db.js.map