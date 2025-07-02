import express, { Express, Request, RequestHandler, Response } from 'express';
import {OrderController} from './order/infrastructure/controllers/orderController';
import {Factory} from "./factory";
import {OrderUseCase} from "./order/application/order";
import {OrderRepository} from "./order/domain/repository/repository";

/**
 * @param serverPort
 */
export async function createServer(serverPort: string) {
    const app: Express = express();
    app.use(express.json());

    const orderMongoRepository: OrderRepository = await Factory.getOrderRepository();
    const orderUseCase: OrderUseCase = Factory.createOrderUseCase(orderMongoRepository);
    const orderController: OrderController = Factory.createOrderController(orderUseCase);

    app.post('/orders', ((req: Request, res: Response) => orderController.createOrder(req, res)) as RequestHandler);
    app.get('/orders', ((req: Request, res: Response) => orderController.getAllOrders(req, res)) as RequestHandler);
    app.put('/orders/:id', ((req: Request, res: Response) => orderController.updateOrder(req, res)) as RequestHandler);
    app.post('/orders/:id/complete', ((req: Request, res: Response) => orderController.completeOrder(req, res)) as RequestHandler);
    app.delete('/orders/:id', ((req: Request, res: Response) => orderController.deleteOrder(req, res)) as RequestHandler);
    app.get('/', ((req: Request, res: Response) => {
        console.log("GET /");
        res.send({status: 'ok'});
    }) as RequestHandler);

    return app.listen(serverPort, () => {
        console.log(`Server running on port ${serverPort}`);
    });
}
