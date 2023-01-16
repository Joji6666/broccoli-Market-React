import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
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
  });

  return (
    <>
      <h1>상세페이지</h1>
      {product.map((data) => {
        return (
          <div className="product-container">
            <div
              style={{ backgroundImage: `url(${data.data().imageUrl[0]})` }}
            ></div>
            <div>{data.data().title}</div>
            <div>{data.data().price}</div>
            <div>{data.data().seller}</div>
            <div>{data.data().date}</div>
            <div>{data.data().content}</div>

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
