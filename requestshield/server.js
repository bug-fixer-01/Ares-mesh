import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './src/routes/authRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import gatewayRoutes from './src/routes/gatewayRoutes.js';
import analyticsRoutes from './src/routes/analyticsRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/admin', analyticsRoutes);
app.use('/', gatewayRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);


app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
