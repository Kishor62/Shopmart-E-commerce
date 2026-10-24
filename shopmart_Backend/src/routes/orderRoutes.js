import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.route("/").post(createOrder).get(adminOnly, getAllOrders);
router.get("/my", getMyOrders); // /:id se pehle hona zaroori hai
router.get("/:id", getOrder);
router.put("/:id/cancel", cancelOrder);
router.put("/:id/status", adminOnly, updateOrderStatus);

export default router;
