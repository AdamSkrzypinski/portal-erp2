import express, { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import orderRoutes from './routes/orderRoutes';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req: ExpressRequest, res: ExpressResponse) => {
  res.send('Serwer ERP II dla Firma Sp. J. działa poprawnie!');
});

app.listen(PORT, () => {
  console.log(`✅ Serwer działa na porcie: ${PORT}`);
});