import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { multipleUpload } from "../middleware/multer.js";
import { addProduct, deleteProduct, getAllProducts, getUserProducts, updateProduct, viewProductById } from "../controllers/productController.js";


const router = express.Router();

router.post("/add", isAuthenticated, multipleUpload, addProduct);
router.get("/allProducts", getAllProducts);
router.delete("/delete/:productId", isAuthenticated, deleteProduct);
router.put("/update/:productId", isAuthenticated, multipleUpload, updateProduct);
router.get("/myProducts/:userId", isAuthenticated, getUserProducts);
router.get("/:productId", viewProductById);

export default router;