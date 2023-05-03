import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Footer from "./components/layouts/footer/Footer";
import Header from "./components/layouts/Header/Header";

import Home from "./components/Home/Home";
import ProductDetails from "./components/Product/ProductDetails";
import Products from "./components/Product/Product";
import Search from "./components/Product/Search";
import LoginSignUp from "./components/User/Login";

import { store } from "./redux/store";
import { loadUser } from "./redux/actions/userActions";
import OptionsUser from "./components/layouts/Header/UserOptions";

import { useSelector } from "react-redux";
import Profile from "./components/User/Profile";
import UpdateProfile from "./components/User/UpdateProfile";
import UpdatePassword from "./components/User/UpdatePassword";
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";
import Cart from "./components/Cart/Cart";
import Shipping from "./components/Cart/Shipping";
import ConfirmOrder from "./components/Cart/ConfirmOrder";
import OrderSuccess from "./components/Cart/OrderSuccess";

import { Navigate, Link } from "react-router-dom"
import Payment from "./components/Cart/Payment";

import axios from "axios";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import MyOrder from "./components/Order/MyOrder";
import OrderDetail from "./components/Order/OrderDetail";
import RouteProtect from "./components/Route/ProtectedRoute";

import About from "./components/layouts/About/About";
import Contact from "./components/layouts/Contact/Contact";
import NotFound from "./components/layouts/NotFound/NotFound"

import Dashboard from "./components/Admin/Dashboard";
import NewProduct from "./components/admin/NewProduct";
import OrderList from "./components/Admin/OrderList";
import ProcessOrder from "./components/Admin/ProcessOrder";
import ProductList from "./components/Admin/ProductList";
import ProductReviews from "./components/Admin/ProductReview";
import UsersList from "./components/Admin/UserList";
import UpdateProduct from "./components/Admin/UpdateProduct";
import UpdateUser from "./components/Admin/UpdateUser";

const App = () => {
  // https://www.youtube.com/watch?v=AN3t-OmdyKA&t=45263s
  const { isAuthenticated, user } = useSelector(state => state.user);
  const navigate = useNavigate();

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const res = await axios.get("http://localhost:4000/api/v1/payment/stripeapikey", {
      withCredentials: true
    });
    setStripeApiKey(res.data.stripeApi);
  };

  useEffect(() => {
    store.dispatch(loadUser());
    getStripeApiKey();
  }, [])

  useEffect(() => {
    if(!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated])

  return (
    <>
      <Header />
      {isAuthenticated && <OptionsUser user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} >
          <Route path=":keyword" element={Products} />
        </Route>

        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/account" element={<Profile />} />
        <Route path="/me/update" element={<UpdateProfile />} />
        <Route path="/password/update" element={<UpdatePassword />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset" element={<ResetPassword />} />
        <Route path="/cart" element=
          {isAuthenticated ? <Cart /> : <Navigate to="/login" />} />

        <Route path="/login/shipping" element={<Shipping />} />
        <Route path="/order/confirm" element={<ConfirmOrder />} />
        {
          stripeApiKey &&
          <Route path="/process/payment"
            element={
              <Elements stripe={loadStripe(stripeApiKey)}>
                <Payment />
              </Elements>
            }
          />
        }
        <Route path="/success" element={<OrderSuccess />} />
        <Route path="/orders" element={<MyOrder />} />
        <Route path="/order/:id" element={<OrderDetail />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route

          path="/admin/products"
          element={<ProductList />}
        />
        <Route

          path="/admin/product"
          element={<NewProduct />}
        />

        <Route

          path="/admin/product/:id"
          element={<UpdateProduct />}
        />
        <Route

          path="/admin/orders"
          element={<OrderList />}
        />

        <Route

          path="/admin/order/:id"
          element={<ProcessOrder />}
        />
        <Route

          path="/admin/users"
          element={<UsersList />}
        />

        <Route

          path="/admin/user/:id"
          element={<UpdateUser />}
        />

        <Route

          path="/admin/reviews"
          element={<ProductReviews />}
        />


        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
};

export default App;