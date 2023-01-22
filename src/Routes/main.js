import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";
import mainPhotoCard from "../images/main1-1.png";
import mainPhotoCard2 from "../images/main1-2.png";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

export default function Main() {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    getDocs(collection(db, "product")).then(async (data) => {
      let products = data.docs;
      // getDocs로 가져온 product doc들을 sort를 이용하여 like수가 많은순으로 정렬
      await products.sort(
        (a, b) => b.data().like.length - a.data().like.length
      );
      await setProduct(products);
    });
  }, []);

  const nav = useNavigate();
  window.addEventListener("scroll", () => {
    let value = window.scrollY;
    console.log(value);

    if (value > 600) {
      ref.current.style = "animation: textSlide 1.2s ease-in-out forwards; ";
      ref2.current.style = "animation: textSlide2 1.2s ease-in-out forwards; ";
    }
    if (value < 220) {
      ref.current.style = "animation: returnSlide 1.2s ease-in-out forwards; ";
      ref2.current.style =
        "animation: returnSlide2 1.2s ease-in-out forwards; ";
    }

    if (value > 1130) {
      ref.current.style = "animation: returnSlide 1.2s ease-in-out forwards; ";
      ref2.current.style =
        "animation: returnSlide2 1.2s ease-in-out forwards; ";
    }
  });

  const ref = useRef();
  const ref2 = useRef();
  return (
    <>
      <main>
        <div className="main-container">
          <div className="main-1">
            <span>건강한 중고거래 브로콜리마켓</span>

            <div>
              <img className="mainPhotoCard1" src={mainPhotoCard} />
              <img className="mainPhotoCard2" src={mainPhotoCard2} />
            </div>
            <span
              className="navAuth"
              onClick={() => {
                nav("/market");
              }}
            >
              마켓 둘러보기
            </span>
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
            현재 인기 상품
            {/* 0부터 15개의 데이터만 보여준다. */}
            {product.slice(0, 15).map((data) => {
              return (
                <div>
                  <Link className="detail-nav" to={`/detail?id=${data.id}`}>
                    <div
                      className="thumbnail"
                      style={{
                        backgroundImage: `url(${data.data().imageUrl[0]})`,
                      }}
                    ></div>
                    <div>상품명:{data.data().title}</div>
                    <div>상품가격:{data.data().price}</div>
                    <div>판매자:{data.data().seller}</div>
                    <div>올린 날짜:{data.data().date}</div>
                  </Link>
                  <div>좋아요:{data.data().like.length}</div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
