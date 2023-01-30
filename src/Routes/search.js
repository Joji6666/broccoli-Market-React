import React from "react";
import { Link } from "react-router-dom";
import wishlist from "../wishlist.png";

export default function Search(props) {
  return (
    <div className="product-warp">
      <h1>검색 상품</h1>
      {console.log(props.filteredProducts)}
      <div className="product-container">
        {props.filteredProducts.map((data) => {
          console.log(data);
          return (
            <div className="product-box">
              <Link
                style={{ textDecoration: "none", color: "black" }}
                className="detail-nav"
                to={`/detail?id=${data.id}`}
              >
                <img className="thumbnail" src={data.data().imageUrl[0]} />

                <div>상품명:{data.data().title}</div>
                <div>상품가격:{data.data().price}</div>
              </Link>
              <div
                onClick={() => {
                  props.setProductId(data.id);
                }}
                className="wish"
              >
                <img className="wish-logo" src={wishlist} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
