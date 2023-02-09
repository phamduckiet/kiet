import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { productsReducer, productDetailsReducer, newReviewReducer, productReviewsReducer,  reviewReducer, newProductReducer
} from "./reducers/productReducer";
import { userReducer, profileReducer, forgotPasswordReducer , allUsersReducer,userDetailsReducer} from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducer";
import { newOrderReducer, orderDetailsReducer, myOrdersReducer, allOrdersReducer,orderReducer} from "./reducers/orderReducer";

const reducer = combineReducers({
    products : productsReducer,
    productDetails : productDetailsReducer,
    newReview : newReviewReducer,
    user : userReducer,
    profile : profileReducer,
    forgotPassword : forgotPasswordReducer,
    cart : cartReducer,
    newOrder : newOrderReducer,
    orderDetails : orderDetailsReducer,
    myOrders : myOrdersReducer,
    allOrders: allOrdersReducer,
    order: orderReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer,
    productReviews: productReviewsReducer,
    review: reviewReducer,
    newProduct: newProductReducer,

});

let initstate = {
    cart: {
        cartItems: localStorage.getItem("cartItems")
          ? JSON.parse(localStorage.getItem("cartItems"))
          : [],
        shippingInfo: localStorage.getItem("shippingInfo")
          ? JSON.parse(localStorage.getItem("shippingInfo"))
          : {},
        },
}

export const store = createStore(reducer, initstate, 
    composeWithDevTools(applyMiddleware(thunk))
);