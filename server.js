import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import colors from 'colors';
import connectDB from './config/db.js';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';

import authRoutes from './routes/authRoute.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

// Database configuration
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

// Test API endpoint
app.get('/', (req, res) => {
  res.send('<h1>Welcome to ecommerce app</h1>');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(500).json({
    message: 'Something broke!',
    error: err.message
  });
});

const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`.bgCyan.white);
});
