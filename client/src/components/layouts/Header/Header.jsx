import React from "react";
import { logo } from "../../../assets/imgs";
import "./header.css";
import {Link} from "react-router-dom";
import {BiSearchAlt2} from "react-icons/bi";
import {AiOutlineUser} from "react-icons/ai";
import {FiShoppingCart} from "react-icons/fi";
import { useSelector } from "react-redux";

const Header = () =>{
    const { error, loading, isAuthenticated } = useSelector(
        (state) => state.user
    );
    return (
        <div className="header">
            <div className="hearder_left">
                <img src={logo} alt="" />
            </div>
            <ul className="header__center">
                <li>
                    <Link to ="/" >HOME</Link >
                </li>
                <li>
                    <Link to ="/products" >PRODUCTS</Link >
                </li>
                <li>
                    <Link to ="/contact" >CONTACT</Link >
                </li>
                <li>
                    <Link to ="/about" >ABOUT</Link >
                </li>
            </ul>
            <div className="header_right">
                <Link to = "/search">
                    <BiSearchAlt2 />
                </Link>
                <Link to = {`${isAuthenticated ? "/account" : "/login"} `}>
                    <AiOutlineUser/>
                </Link>
                <Link to = "/cart">
                    <FiShoppingCart/>   
                </Link>
            </div>
        </div>
    )
}

export default Header;