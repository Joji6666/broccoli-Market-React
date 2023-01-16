import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { db } from "../firebase";
import "../style.css";

export default function Market() {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    getDocs(collection(db, "product")).then((data) => {
      setProduct(data.docs);
    });
  }, []);

  product.map((data) => {
    console.log(data.data());
    console.log(data.id);
  });

  return (
    <>
      <h1>상세페이지</h1>
      {product.map((data) => {
        return (
          <div className="product-container">
            <Link to={`/detail?id=${data.id}`}>
              <div
                className="thumbnail"
                style={{ backgroundImage: `url(${data.data().imageUrl[0]})` }}
              ></div>
              <div>상품명:{data.data().title}</div>
              <div>상품가격:{data.data().price}</div>
              <div>판매자:{data.data().seller}</div>
              <div>올린 날짜:{data.data().date}</div>
            </Link>

            {/* <div
              className="product-image"
              style={{
                backgroundImage: `url(${data.data().imageUrl[0]})`,
              }}
            ></div>
            <div className="product-title">{data.data().title}</div>
            <div className="product-price">{data.data().price}</div>
            <div className="product-date">{data.data().date}</div>
            <div className="product-seller">{data.data().seller}</div>
            <div className="product-seller">{data.data().content}</div> */}
          </div>
        );
      })}
    </>
  );
}
