import express from 'express';
import { isAuthenticated } from "../middleware/authentication.js";
import { processPayment, sendStripeApiKey} from "../controllers/paymentControllers.js";
const router = express.Router();

router.post('/process', isAuthenticated, processPayment);

router.get('/stripeapikey', isAuthenticated, sendStripeApiKey);

export default router;