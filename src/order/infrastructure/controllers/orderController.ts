import {Request, Response} from 'express';
import {OrderDto} from "../../domain/aggregate/order";
import {DomainError} from "../../domain/error/error";
import {Factory} from "../../../factory";
import {OrderRepository} from "../../domain/repository/repository";
import {OrderUseCase} from "../../application/order";

export class OrderController {
    constructor(private readonly orderUseCase: OrderUseCase) {}
    /**
     * @param req
     * @param res
     */
    async createOrder(req: Request, res: Response) {
        try {
            const requestOrder = req.body;

            const createdOrder = await this.orderUseCase.createOrderUseCase(requestOrder);

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
     */
    async getAllOrders(req: Request, res: Response) {
        const ordersDto: OrderDto[] = await this.orderUseCase.getAllOrdersUseCase();
        res.json(ordersDto);
    }

    /**
     * @param req
     * @param res
     */
    async updateOrder(req: Request, res: Response) {
        const {id} = req.params;
        const {status, shippingAddress, discountCode} = req.body;

        const dto = {
            id,
            status,
            shippingAddress,
            discountCode,
        };

        const updatedOrder = await this.orderUseCase.updateOrderUseCase(dto);
        res.send(updatedOrder);
    }

    /**
     * @param req
     * @param res
     */
    async completeOrder(req: Request, res: Response) {
        try {
            const {id} = req.params;

            const completedOrder = await this.orderUseCase.completeOrderUseCase(id);

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
     */
    async deleteOrder(req: Request, res: Response) {
        const {id} = req.params;

        const deletedOrder = await this.orderUseCase.deleteOrderUseCase(id);
        res.send(deletedOrder);
    }
}
