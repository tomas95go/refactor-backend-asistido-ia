import express, { Express, Request, RequestHandler, Response } from 'express';
import mongoose from 'mongoose';
import {
    deleteOrder,
    OrderController
} from './order/infrastructure/controllers/orderController';

/**
 * @param serverPort
 * @param databaseConnectionString
 */
export function createServer(serverPort: string, databaseConnectionString: string) {
    mongoose
        .connect(databaseConnectionString)
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.error('Error connecting to MongoDB:', err));

    const app: Express = express();
    app.use(express.json());

    const orderController = new OrderController();

    app.post('/orders', ((req: Request, res: Response) => orderController.createOrder(req, res)) as RequestHandler);
    app.get('/orders', ((req: Request, res: Response) => orderController.getAllOrders(req, res)) as RequestHandler);
    app.put('/orders/:id', ((req: Request, res: Response) => orderController.updateOrder(req, res)) as RequestHandler);
    app.post('/orders/:id/complete', ((req: Request, res: Response) => orderController.completeOrder(req, res)) as RequestHandler);
    app.delete('/orders/:id', ((req: Request, res: Response) => deleteOrder(req, res)) as RequestHandler);
    app.get('/', ((req: Request, res: Response) => {
        console.log("GET /");
        res.send({status: 'ok'});
    }) as RequestHandler);

    return app.listen(serverPort, () => {
        console.log(`Server running on port ${serverPort}`);
    });
}
