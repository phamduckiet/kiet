import express from 'express';
import { createProduct, getAllProducts, getProductId, updateProduct, deleteProduct , createProductReview, deleteReview, getProductReviews,getAdminProduct } from "../controllers/productController.js";
import { isAuthenticated, role } from "../middleware/authentication.js";

const router = express.Router();


router.delete("/review", isAuthenticated, deleteReview);
router.get('/review', getProductReviews);
router.put('/review', isAuthenticated, createProductReview);

router.get('/admin/',  isAuthenticated, role(["admin"]), getAdminProduct);
router.post('/new', isAuthenticated, role(["admin"]), createProduct);
router.put('/:id', isAuthenticated, role(["admin"]), updateProduct);
router.delete("/:id", isAuthenticated, role(["admin"]), deleteProduct);
router.get('/:id', getProductId);

router.get('/', getAllProducts);


export default router;