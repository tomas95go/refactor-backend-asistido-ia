import express, { Express, Request, RequestHandler, Response } from 'express';
import mongoose from 'mongoose';
import {OrderController} from './order/infrastructure/controllers/orderController';
import {OrderRepository} from "./order/domain/repository/repository";
import {Factory} from "./factory";
import {OrderUseCase} from "./order/application/order";

/**
 * @param serverPort
 */
export async function createServer(serverPort: string) {
    const app: Express = express();
    app.use(express.json());

    const repository: OrderRepository = await Factory.getOrderRepository();

    const orderController: OrderController = new OrderController();

    const orderUseCase: OrderUseCase = new OrderUseCase(repository);

    app.post('/orders', ((req: Request, res: Response) => orderController.createOrder(req, res, orderUseCase)) as RequestHandler);
    app.get('/orders', ((req: Request, res: Response) => orderController.getAllOrders(req, res, orderUseCase)) as RequestHandler);
    app.put('/orders/:id', ((req: Request, res: Response) => orderController.updateOrder(req, res, orderUseCase)) as RequestHandler);
    app.post('/orders/:id/complete', ((req: Request, res: Response) => orderController.completeOrder(req, res, orderUseCase)) as RequestHandler);
    app.delete('/orders/:id', ((req: Request, res: Response) => orderController.deleteOrder(req, res, orderUseCase)) as RequestHandler);
    app.get('/', ((req: Request, res: Response) => {
        console.log("GET /");
        res.send({status: 'ok'});
    }) as RequestHandler);

    return app.listen(serverPort, () => {
        console.log(`Server running on port ${serverPort}`);
    });
}
