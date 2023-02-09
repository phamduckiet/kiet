import productRoute from "./productRoute.js";
import userRoute from "./userRoute.js";
import ordersRoute from "./orderRoute.js";
import paymentRoute from "./paymentRoute.js";

const router = (app)=>{
    app.use('/api/v1/orders', ordersRoute)
    app.use('/api/v1/products', productRoute);
    app.use('/api/v1', userRoute);
    app.use('/api/v1/payment', paymentRoute);
}

export default router