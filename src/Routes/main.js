import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";
import "./main.css";
import "./market.css";
import mainPhotoCard from "../images/main1-1.png";
import mainPhotoCard2 from "../images/main1-2.png";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import ProductBox from "../componets/productBox";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUserName, setUserUid } from "../store";
import { useAuth } from "../utils/utils";

export default function Main() {
  const [product, setProduct] = useState([]);
  const dispatch = useDispatch();

  useAuth();

  useEffect(() => {
    getDocs(collection(db, "product")).then(async (data) => {
      const products = data.docs;
      // getDocs로 가져온 product doc들을 sort를 이용하여 like수가 많은순으로 정렬
      await products.sort(
        (a, b) => b.data().like.length - a.data().like.length
      );
      await setProduct(products);
    });
  }, []);

  const nav = useNavigate();

  const ref = useRef();
  const ref2 = useRef();

  return (
    <>
      <main>
        <div className="main-container">
          <div className="main-1">
            <div className="text-box">
              <span>건강한 중고거래</span>
              <span>브로콜리마켓</span>

              <span
                className="navAuth"
                onClick={() => {
                  nav("/market");
                }}
              >
                마켓 둘러보기
              </span>
            </div>
            <div className="photobox">
              <img className="mainPhotoCard1" src={mainPhotoCard} />
              <img className="mainPhotoCard2" src={mainPhotoCard2} />
            </div>
          </div>
          <div className="main-2">
            <span ref={ref}>안쓰는물건들을 지금 당장 판매하세요.</span>
            <span
              ref={ref2}
              className="navMarket"
              onClick={() => {
                nav("/auth");
              }}
            >
              간편 가입하고 시작하기
            </span>
          </div>

          <div className="main-3">
            <div className="product-warp">
              <span id="best-product">최고 인기 상품</span>
              <div
                className="product-container"
                style={{ height: "1300px", overflowY: "scroll" }}
              >
                {/* 0부터 15개의 데이터만 보여준다. */}
                {product.slice(0, 15).map((data) => {
                  return <ProductBox data={data} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
