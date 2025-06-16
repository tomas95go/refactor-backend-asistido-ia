// Infrastructure
import express, { Request, RequestHandler, Response } from "express";
import { OrderController } from "../api/order.controller";

const router = express.Router();

router.get('/', ((req: Request, res: Response) => OrderController.listOrders(req, res)) as RequestHandler);
router.post('/', ((req: Request, res: Response) => OrderController.createOrder(req, res)) as RequestHandler);
router.put('/:id', ((req: Request, res: Response) => OrderController.updateOrder(req, res)) as RequestHandler);
router.post('/:id/complete', ((req: Request, res: Response) => OrderController.completeOrder(req, res)) as RequestHandler);
router.delete('/:id', ((req: Request, res: Response) => OrderController.deleteOrder(req, res)) as RequestHandler);

export default router;