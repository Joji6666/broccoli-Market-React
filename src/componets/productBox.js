import React from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "../Routes/market.css";
import LikeBtn from "../utils/likeBtn";

export default function ProductBox(props) {
  return (
    <div className="product-box">
      <Link
        style={{ textDecoration: "none", color: "black" }}
        className="detail-nav"
        to={`/detail?id=${props.data.id}`}
      >
        <img className="thumbnail" src={props.data.data().imageUrl[0]} />

        <div>상품명:{props.data.data().title}</div>
        <div>상품가격:{props.data.data().price}원</div>
      </Link>
      <LikeBtn productId={props.data.id} />
      <ToastContainer
        position="bottom-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
