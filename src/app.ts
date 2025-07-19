import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import flagRoutes from './routes/flag.routes';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/flags', flagRoutes);

const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('Feature Flag API is live 🎉');
});
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

