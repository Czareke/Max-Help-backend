// Required Modules and Imports
const authRoutes = require('./routes/authRoutes');
const catalogueRoutes = require('./routes/catalogueRoutes');
const dataFeedRoutes = require('./routes/dataFeedRoutes');
const imageUploadRoutes = require('./routes/imageUploadRoutes');
const productRoutes = require('./routes/productRoutes');
const skuRoutes = require('./routes/skuRoutes');
const feedRoutes = require('./routes/feedRoutes');
const inventoryRoutes = require('./routes/InventoryRoutes');
const userRoutes = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const cloudinary = require('cloudinary').v2;
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const globalErrorHandler = require('./controllers/errorController');

// dotenv.config(); // Uncomment if using .env file
dotenv.config(); // Load environment variables from .env

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:3000', // Replace with your frontend's origin
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Allowed methods
    credentials: true, // Allow cookies if needed
  })
);

// Root Route
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the Max Help API!</h1>
    <p>Explore the <a href="/api-docs">API Documentation</a></p>
  `);
});

// Swagger for API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/catalogues', catalogueRoutes);
app.use('/api/v1/data-feeds', dataFeedRoutes);
app.use('/api/v1/images', imageUploadRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/skus', skuRoutes);
app.use('/api/v1/feeds', feedRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/users', userRoutes);

// Catch-all for undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
