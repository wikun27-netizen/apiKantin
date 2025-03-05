import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import trxRoutes from './routes/trxRoutes.js';

const app = express();

const corsOptions = {
    origin: ['http://localhost:5173'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };

// Middleware
app.use(morgan('dev'));
// app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.json({ message: 'Walcome to my API'});
})

// Routes
app.use('/user', userRoutes);
app.use('/trx', trxRoutes);

export default app;
