import { Router } from "express";
import {
  getProducts,
  getCategories,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { uploadProductImages } from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/", getProducts);
router.get("/categories", getCategories); // /:id se pehle hona zaroori hai
router.get("/:id", getProduct);

router.post("/", protect, adminOnly, uploadProductImages, createProduct);
router.put("/:id", protect, adminOnly, uploadProductImages, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
