import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb } from './config/db.js';
import router from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors({
  origin: '*', // For development, allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Main Router mapping
app.use('/api', router);

// Root path diagnostic route
app.get('/', (req, res) => {
  res.json({ message: 'MERN Employee Dashboard API is running.' });
});

// Start DB connection then listen
async function startServer() {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`📡 Server running on port ${PORT}`);
  });
}

startServer();
