import {Request, Response} from 'express';
import {OrderDto} from "../../domain/aggregate/order";
import {DomainError} from "../../domain/error/error";
import {Factory} from "../../../factory";
import {OrderRepository} from "../../domain/repository/repository";
import {OrderUseCase} from "../../application/order";

export class OrderController {
    async createOrder(req: Request, res: Response) {
        const repository: OrderRepository = await Factory.getOrderRepository();
        try {
            const requestOrder = req.body;

            const createdOrder = await new OrderUseCase(repository).createOrderUseCase(requestOrder);

            res.send(createdOrder);
        } catch (error) {
            if (error instanceof DomainError) {
                return res.send(error.message);
            }
            res.send('Unexpected error');
        }
    }

    async getAllOrders(req: Request, res: Response) {
        const repository: OrderRepository = await Factory.getOrderRepository();
        const ordersDto: OrderDto[] = await new OrderUseCase(repository).getAllOrdersUseCase();
        res.json(ordersDto);
    }

    async updateOrder(req: Request, res: Response) {
        const repository: OrderRepository = await Factory.getOrderRepository();

        const {id} = req.params;
        const {status, shippingAddress, discountCode} = req.body;

        const dto = {
            id,
            status,
            shippingAddress,
            discountCode,
        };

        const updatedOrder = await new OrderUseCase(repository).updateOrderUseCase(dto);
        res.send(updatedOrder);
    }

    async completeOrder(req: Request, res: Response) {
        try {
            const {id} = req.params;

            const repository: OrderRepository = await Factory.getOrderRepository();
            const completedOrder = await new OrderUseCase(repository).completeOrderUseCase(id);

            res.send(completedOrder);
        } catch (error) {
            if (error instanceof DomainError) {
                return res.send(error.message);
            }
            res.send('Unexpected error');
        }
    }
}

export const deleteOrder = async (req: Request, res: Response) => {
    const repository: OrderRepository = await Factory.getOrderRepository();

    const { id } = req.params;

    const deletedOrder = await new OrderUseCase(repository).deleteOrderUseCase(id);
    res.send(deletedOrder);
};
