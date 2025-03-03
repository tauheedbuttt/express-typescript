import mongoose from "mongoose";

const NODE_ENV: any = process.env.NODE_ENV;
const MONGO_DB_URL: any =
  NODE_ENV === "development"
    ? process.env.MONGO_DB_DEV
    : process.env.MONGO_DB_PROD;
const options = {
  autoIndex: true, // Build Indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
};

export const DBConnection = async () => {
  try {
    const db = await mongoose.connect(MONGO_DB_URL, options);
    console.log(`MongoDB Connection Established On host ${db.connection.host}`);
  } catch (error: any) {
    console.log(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default mongoose;
