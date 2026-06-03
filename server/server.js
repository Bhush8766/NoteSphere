import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import userRoutes from "./routes/userRoutes.js";


dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    console.log('MongoDB Connected')
  )
  .catch((err) => console.log(err));

app.use('/api/auth', authRoutes);

app.use('/api/notes', noteRoutes);

app.use('/api/reminders', reminderRoutes);

app.use("/uploads", express.static("uploads"));

app.use("/api/users", userRoutes);

app.get('/', (req, res) => {
  res.send('API Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});