import React from "react";
import { Link } from "react-router-dom";
import Rating from '@mui/material/Rating';
import ReactStars from "react-rating-stars-component";

const ProductCard = ({ product }) => {
  const options = {
    value: product.ratings,
    color : "rgba(20,20,20,0.1)",
    activeColor : "tomato",
    edit : false,
    size : window.innerWidth < 600 ? 20 : 25,
    isHalf : true,
  };

  // console.log(Object.values(product?.images[0].url).join(''));

  return (
    <Link className="productCard" to={`/product/${product._id}`}>
      <img src={'https://res.cloudinary.com/dkrqq8jer/image/upload/v1683105260/avatars/qwckzq8gbon0yuuetc7i.png'} alt={product.name} />
      <p>{product.name}</p>
      <div>
          <ReactStars {...options} />,
          <span className="productCardSpan">
              ({product.numOfReviews} Reviews)
          </span>
      </div>
      <span>{`₹${product.price}`}</span>
    </Link>
  );
};

export default ProductCard;