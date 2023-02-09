import ProductModel from "../models/productModel.js";
import ErrorHandler from "../ultils/errorhander.js";
import ApiFeatures from "../ultils/apifeatures.js";
import { catchAsyncModels } from "../middleware/catchAsyncErrors.js";
import cloudinary from "cloudinary";

export const createProduct = catchAsyncModels ( 
    async (req, res, next) =>{

        try {
            let images = [];

            if (typeof req.body.images === "string") {
                images.push(req.body.images);
            } else {
                images = req.body.images;
            }

            const imagesLinks = [];

            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
                });

                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }

            req.body.images = imagesLinks;

            req.body.user = req.user.id;

            const newProduct = new ProductModel(req.body);
            const savedProduct = await newProduct.save();
            res.status(201).json({
                product : savedProduct,
                success : true
            })
        } catch (error) {
            res.status(500).json({
                message: error.message,
                success : false
            });
        }
    }
);

export const getAllProducts = async (req, res, next) =>{
    try {
        const resultPerPage = 8;
        const totalProducts = await ProductModel.countDocuments();
        const apifeatures = new ApiFeatures(ProductModel.find(), req.query).search().filter();

        let filteredProductsCount = await apifeatures.query.length;

        apifeatures.pagination(resultPerPage);
        let products = await apifeatures.query;


        res.status(200).json({
            products,
            success : true,
            totalProducts,
            resultPerPage,
            filteredProductsCount,
        })
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getProductId = async (req, res, next) =>{
    try {
        const product = await ProductModel.findById(req.params.id);

        if(!product) return next(new ErrorHandler("Product not found", 404));

        res.status(200).json({
            product ,
            success : true
        })
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const updateProduct = catchAsyncModels(
    async (req, res, next) =>{
        try {
            let product = await ProductModel.findById(req.params.id);
            if(!product) return next(new ErrorHandler("Product not found", 404));
    
            product = await ProductModel.findByIdAndUpdate(req.params.id, req.body,{
                new : true,
                runValidators : true,
                useFindAndModify :false
            })
    
            res.status(200).json({
                product ,
                success : true
            })
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
);

export const getAdminProduct = async (req, res, next) =>{
    try {
        const products = await ProductModel.find();
       
        res.status(200).json({
            products ,
            success : true
        })
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const deleteProduct = async (req, res, next) =>{
    try {
        const product = await ProductModel.findById(req.params.id);
        if(!product) return next(new ErrorHandler("Product not found", 404));

        await product.remove();
        res.status(201).json({
            message : 'Product deleted successfully',
            success : true
        })
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// create review and update review
export const createProductReview = catchAsyncModels(
    async ( req, res, next) => {
        const { comment, productId, rating } = req.body;
      
        const review = {
            user : req.user._id,
            name : req.user.name,
            rating : Number(rating),
            comment 
        };

        const product = await ProductModel.findById(productId);
       
        const isReview = product.reviews.find(
            rev => rev.user.toString() === req.user._id.toString()
        );

        if(isReview) {
            // nếu đã có review của userId
            product.reviews.forEach(rev => {
                // update review for userID
                if(rev.user.toString() === req.user._id.toString()){
                    rev.rating = rating;
                    rev.comment = comment;  
                    }
                }
            )
        }else{
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        };

        // tính trung bình cộng
        let avg = 0;
        product.reviews.forEach(rev => {
            avg += rev.rating;
        });

        product.ratings = avg / product.reviews.length;

        await product.save( {validateBeforeSave : false} );
        res.status(200).json({
            success : true,
        })
    }
);

// get all reviews of product
export const getProductReviews = catchAsyncModels(
    async ( req, res, next ) => {
        const product = await ProductModel.findById(req.query.productId);
        if(!product) return next(new ErrorHandler("Product not found", 404));
        
        res.status(200).json({
            success : true,
            reviews : product.reviews
        });
    }
);

// delete review

export const deleteReview = catchAsyncModels(
    async ( req, res, next ) => {
        const product = await ProductModel.findById(req.query.productId);
        if(!product) return next(new ErrorHandler("Product not found", 404));
        
        const reviews = product.reviews.filter(
            rev => rev.user.toString() !== req.query.userId.toString()
        );

        let avg = 0;
        reviews.forEach(rev => {
            avg += rev.rating;
        });

        const ratings = avg / reviews.length;
        const numOfReviews = reviews.length;

        await ProductModel.findByIdAndUpdate(req.query.productId, {
            reviews,
            numOfReviews,
            ratings
        }, 
        {
            new : true,
            runValidators : true,
            useFindAndModify : false
        });

        res.status(200).json({
            success : true,
            reviews,
            numOfReviews,
            ratings
        });
    }
);