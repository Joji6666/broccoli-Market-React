import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


export default function Search() {
  const { filteredProduct } = useSelector((state) => state.filteredProduct);
  return (
    <div className="product-warp">
      <h1>검색 상품</h1>
      {console.log(filteredProduct)}
      <div className="product-container">
        {filteredProduct.map((data) => {
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
                <div>상품가격:{data.data().price}원</div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
