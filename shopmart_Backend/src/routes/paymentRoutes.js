import { Router } from "express";
import { createPaymentOrder, verifyPayment } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.post("/create-order", createPaymentOrder);
router.post("/verify", verifyPayment);

export default router;
