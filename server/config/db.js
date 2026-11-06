import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && !uri.includes('<username>') && !uri.includes('<password>')) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host} / ${conn.connection.name}`);
      return true;
    } catch (error) {
      console.error(`⚠️ MongoDB Atlas Connection Error: ${error.message}`);
      console.log('Falling back to local MongoDB engine for uninterrupted demonstration...');
    }
  }

  // Fallback to local MongoDB engine (real mongod instance via mongodb-memory-server)
  try {
    mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    await mongoose.connect(memUri);
    console.log(`✅ MongoDB Local Engine Connected: ${memUri}`);
    return true;
  } catch (memError) {
    console.error(`❌ Failed to initialize MongoDB: ${memError.message}`);
    return false;
  }
};
