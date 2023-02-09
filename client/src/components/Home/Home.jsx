import React, { Fragment, useEffect } from "react";
import "./Home.css";
import ProductCard from "./ProductCard";
import MetaData from "../layouts/MetaData/MetaData";
import Loader from "../layouts/Loader/Loader";

import { CgMouse } from "react-icons/cg";
import { useAlert } from "react-alert";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../redux/actions/productActions";

const Home = () =>{
    const dispatch = useDispatch();
    const {products, productsTotal, loading, error } = useSelector(state => state.products);
    const alert = useAlert();
  
    useEffect(() => {
      if(error) {
        return alert.error(error);
      }
      dispatch(getProduct());
    }, [dispatch, error])

    return (
        <Fragment>
          {loading ? (
            <Loader />
          ) : (
            <Fragment>
              <MetaData title="ECOMMERCE" />
    
              <div className="banner">
                <p>Welcome to Ecommerce</p>
                <h1>FIND AMAZING PRODUCTS BELOW</h1>
    
                <a href="#container">
                  <button>
                    Scroll <CgMouse />
                  </button>
                </a>
              </div>
    
              <h2 className="homeHeading">Featured Products</h2>
    
              <div className="container" id="container">
               {products &&
                  products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
              </div>
            </Fragment>
          )}
        </Fragment>
      );
    }


export default Home;