import express from 'express';
import dotenv from "dotenv";
import seedAdmin from './seedAdmin.js';
import authRoutes from './routes/authRoutes.js';
import connectToMongoDb from './config/connectToDb.js';

dotenv.config();
const app = express();

app.use(express.json());

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectToMongoDb();
    // seedAdmin();
    console.log(`Server running on port ${PORT}`);
});