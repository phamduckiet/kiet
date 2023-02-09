import express from 'express';
import { newOrder, myOrders, getSingleOrder, getAllOrders, updateOrderStatus, deleteOrder } from "../controllers/ordersController.js";
import { isAuthenticated, role } from "../middleware/authentication.js";

const router = express.Router();

router.post("/new", isAuthenticated, newOrder);
router.get("/me", isAuthenticated, myOrders);
router.get("/:id", isAuthenticated, getSingleOrder);

router.get('/', isAuthenticated, role(["admin"]), getAllOrders);
router.put("/:id", isAuthenticated, role(["admin"]), updateOrderStatus)
router.delete("/:id", isAuthenticated, role(["admin"]), deleteOrder);

export default router;