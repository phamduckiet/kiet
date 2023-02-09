import { catchAsyncModels } from "../middleware/catchAsyncErrors.js";
import Stripe from "stripe";

const stripe = new Stripe('sk_test_51Ko7RwKBxiTZ3akbSLk0AeDgBWFDUtqwdDDamAIfx0KOR5LPFtv4xz6vME7qtyi3DNTt2oLZYsnaQOB6mtb22j6K003fz4rODn');

export const processPayment = catchAsyncModels(
    async (req, res, next) => {
        const myPayment = await stripe.paymentIntents.create({
            amount : req.body.amount,
            currency : "inr",
            metadata : {
                company : "commerce"
            }
        });

        res.status(200).json({ success : true , client_secret: myPayment.client_secret});
    }
);

export const sendStripeApiKey = catchAsyncModels(
    async (req, res, next) => {
        const publickey = "pk_test_51Ko7RwKBxiTZ3akbGb9nz1cYq7AYE96V8WHnXqxLF2tU5JbKccUh1FZPknop7MoH9Z0tyMbur4K3gXuEoSGucL9100M1YDp8Us"

        res.status(200).json({ success : true , stripeApi: publickey});
    }
);