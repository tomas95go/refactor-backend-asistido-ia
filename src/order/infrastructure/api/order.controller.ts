// Infrastructure
import { Request, Response } from 'express';

// Application
import { ICreateOrder } from "../../application/use-cases/create-order/create-order.dto";
import { CreateOrder } from "../../application/use-cases/create-order/create-order.use-case";
import { ListOrders } from "../../application/use-cases/list-orders/list-orders.use-case";
import { IUpdateOrder } from "../../application/use-cases/update-order/update-order.dto";
import { UpdateOrder } from "../../application/use-cases/update-order/update-order.use-case";
import { CompleteOrder } from "../../application/use-cases/complete-order/complete-order.use-case";
import { DeleteOrder } from "../../application/use-cases/delete-order/delete-order.use-case";

export class OrderController {

    static async listOrders(req: Request, res: Response) {
        const orders = await new ListOrders().execute();
        res.json(orders);
    }

    static async createOrder(req: Request, res: Response) {
        try {
            // Extract body from request
            const { items, discountCode, shippingAddress } = req.body;

            // Build dto
            const dto: ICreateOrder = {
                items,
                discountCode,
                shippingAddress
            };

            // Execute use case and return response
            await new CreateOrder().execute(dto);
            res.send(`Order created`);
        } catch (e: any) {
            res.send(e.message);
        }
    }

    static async updateOrder(req: Request, res: Response) {
        try {
            // Extract data from headers and body
            const { id } = req.params;
            const { status, shippingAddress, discountCode } = req.body;

            // Build dto
            const dto: IUpdateOrder = {
                id,
                status,
                shippingAddress,
                discountCode
            };

            // Execute use case and return response
            await new UpdateOrder().execute(dto);
            res.send(`Order updated`);
        } catch (e: any) {
            res.send(e.message);
        }
    }

    static async completeOrder(req: Request, res: Response) {
        try {
            // Extract data from headers
            const { id } = req.params;

            // Execute use case and return response
            await new CompleteOrder().execute(id);
            res.send(`Order with id ${id} completed`);
        } catch(e: any) {
            res.send(e.message);
        }
    }

    static async deleteOrder(req: Request, res: Response) {
        try {
            // Extract data from headers
            const { id } = req.params;

            // Execute use case and return response
            await new DeleteOrder().execute(id);
            res.send('Order deleted');
        } catch (e: any) {
            res.send(e.message);
        }
    }

}
