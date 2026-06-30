import mongoose from 'mongoose';

export const dbStatus = {
  isMongoConnected: false
};

export async function connectDb(uri) {
  const connectionUri = uri || process.env.MONGO_URI || 'mongodb://localhost:27017/employee_db';
  console.log(`Attempting connection to MongoDB at: ${connectionUri}`);
  
  try {
    // Set a small timeout (5s) for connecting, so we fallback quickly instead of hanging
    await mongoose.connect(connectionUri, {
      serverSelectionTimeoutMS: 5000
    });
    dbStatus.isMongoConnected = true;
    console.log('🚀 Connected to MongoDB successfully.');
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed. Falling back to Local JSON File Database...');
    console.warn(`Reason: ${error.message}`);
    dbStatus.isMongoConnected = false;
  }
  return dbStatus.isMongoConnected;
}
