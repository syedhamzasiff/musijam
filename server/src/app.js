import express from 'express';
import authRoutes from './routes/auth.routes.js';
import cors from 'cors';

// Initialize Express app
const app = express();

//add CORS middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use('/api', authRoutes);

export default app;
