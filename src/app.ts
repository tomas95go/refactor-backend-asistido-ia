import express, { Request, Response, RequestHandler } from 'express';
import mongoose from 'mongoose';
import orderRoutes from './order/infrastructure/route/order.route'

const DB_URL = 'mongodb://localhost:27017/db_orders';
const PORT = 3002;

mongoose
    .connect(DB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

export const app = express();
app.use(express.json());

app.use('/orders', orderRoutes);
app.get('/', ((req: Request, res: Response) => {
    console.log("GET /");
    res.send({ status: 'ok' });
}) as RequestHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
