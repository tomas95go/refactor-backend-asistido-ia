import {Request, Response} from 'express';
import {OrderDto} from "../../domain/aggregate/order";
import {DomainError} from "../../domain/error/error";
import {Factory} from "../../../factory";
import {OrderRepository} from "../../domain/repository/repository";
import {OrderUseCase} from "../../application/order";

export class OrderController {
    /**
     * @param req
     * @param res
     * @param orderUseCase
     */
    async createOrder(req: Request, res: Response, orderUseCase: OrderUseCase) {
        try {
            const requestOrder = req.body;

            const createdOrder = await orderUseCase.createOrderUseCase(requestOrder);

            res.send(createdOrder);
        } catch (error) {
            if (error instanceof DomainError) {
                return res.send(error.message);
            }
            res.send('Unexpected error');
        }
    }

    /**
     * @param req
     * @param res
     * @param orderUseCase
     */
    async getAllOrders(req: Request, res: Response, orderUseCase: OrderUseCase) {
        const ordersDto: OrderDto[] = await orderUseCase.getAllOrdersUseCase();
        res.json(ordersDto);
    }

    /**
     * @param req
     * @param res
     * @param orderUseCase
     */
    async updateOrder(req: Request, res: Response, orderUseCase: OrderUseCase) {
        const {id} = req.params;
        const {status, shippingAddress, discountCode} = req.body;

        const dto = {
            id,
            status,
            shippingAddress,
            discountCode,
        };

        const updatedOrder = await orderUseCase.updateOrderUseCase(dto);
        res.send(updatedOrder);
    }

    /**
     * @param req
     * @param res
     * @param orderUseCase
     */
    async completeOrder(req: Request, res: Response, orderUseCase: OrderUseCase) {
        try {
            const {id} = req.params;

            const completedOrder = await orderUseCase.completeOrderUseCase(id);

            res.send(completedOrder);
        } catch (error) {
            if (error instanceof DomainError) {
                return res.send(error.message);
            }
            res.send('Unexpected error');
        }
    }

    /**
     * @param req
     * @param res
     * @param orderUseCase
     */
    async deleteOrder(req: Request, res: Response, orderUseCase: OrderUseCase) {
        const {id} = req.params;

        const deletedOrder = await orderUseCase.deleteOrderUseCase(id);
        res.send(deletedOrder);
    }
}
