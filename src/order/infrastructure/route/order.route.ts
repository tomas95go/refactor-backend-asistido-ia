// Infrastructure
import express, { Request, RequestHandler, Response } from "express";
import { OrderController } from "../api/order.controller";

const router = express.Router();

router.get('/', ((req: Request, res: Response) => OrderController.listOrders(req, res)) as RequestHandler);
router.post('/', ((req: Request, res: Response) => OrderController.createOrder(req, res)) as RequestHandler);
router.put('/:id/apply-discount', ((req: Request, res: Response) => OrderController.applyDiscount(req, res)) as RequestHandler);
router.put('/:id/change-address', ((req: Request, res: Response) => OrderController.changeAddress(req, res)) as RequestHandler);
router.post('/:id/confirm', ((req: Request, res: Response) => OrderController.confirmOrder(req, res)) as RequestHandler);
router.post('/:id/complete', ((req: Request, res: Response) => OrderController.completeOrder(req, res)) as RequestHandler);
router.delete('/:id', ((req: Request, res: Response) => OrderController.deleteOrder(req, res)) as RequestHandler);

export default router;