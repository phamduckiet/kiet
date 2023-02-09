import OrderModel from "../models/orderModel.js";
import ProductModel from "../models/productModel.js";
import ErrorHandler from "../ultils/errorhander.js";
import { catchAsyncModels } from "../middleware/catchAsyncErrors.js";


export const newOrder = catchAsyncModels(
    async ( req, res, next ) => {
        const { 
            shippingInfor,
            orderItems,
            paymentInfor,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body;
       

        const order = await OrderModel.create({
            shippingInfor,
            orderItems,
            paymentInfor,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt : Date.now(),
            user : req.user._id
        });

        res.status(201).json({
            success: true,
            order
        });
    }
);

export const getSingleOrder = catchAsyncModels(
    async (req, res, next) => {
        const order = await OrderModel.findById(req.params.id).populate("user", "name email");

        if(!order) {
            return next(new ErrorHandler("order not found with this id", 400))
        }

        res.status(200).json({
            success: true,
            order
        })
    }
);

// get order then user loged in
export const myOrders = catchAsyncModels(
    async (req, res, next) => {
        const orders = await OrderModel.find({ user : req.user._id });

        res.status(200).json({
            success: true,
            orders
        })
    }
);

// get all
export const getAllOrders = catchAsyncModels(
    async (req, res, next) => {
        const orders = await OrderModel.find();

        let totalAmount = 0;

        orders.forEach(order => {
            totalAmount += order.totalPrice;
        });

        res.status(200).json({
            success: true,
            orders,
            totalAmount
        })
    }
);

async function updateProductStock (productId, quantity) {
    const product = await ProductModel.findById(productId);

    product.Stock = product.Stock - quantity;

    await product.save({validateBeforeSave : false});
};

export const updateOrderStatus = catchAsyncModels(
    async (req, res, next) => {
        const order = await OrderModel.findById(req.params.id);
        
        // nếu đã giao hàng return 
        if(order.orderStatus === "Delivered"){
            return next(new ErrorHandler("You have already delivered this product", 400));
        };

        order.orderItems.forEach( async (item) => {
            await updateProductStock(item.productId, item.quantity);
        });

        order.orderStatus = req.body.status;

        if(req.body.status === "Delivered"){
            order.deliveredAt = Date.now();
        }

        await order.save({validateBeforeSave : false});

        res.status(200).json({
            success: true,
            // order
        })
    }
);

export const deleteOrder = catchAsyncModels(
    async (req, res, next) => {
        const order = await OrderModel.findById(req.params.id);

        if(!order) {
            return next(new ErrorHandler("order not found with this id", 400))
        }

        await order.remove();
        res.status(200).json({
            success: true,
            message : "Order deleted successfully"
        })
    }
);