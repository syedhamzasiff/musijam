import express from 'express';
import authRoutes from './routes/auth.routes.js';

// Initialize Express app
const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use('/api/auth', authRoutes);

export default app;
