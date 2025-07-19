import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import flagRoutes from '../src/routes/flag.routes';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/flags', flagRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
