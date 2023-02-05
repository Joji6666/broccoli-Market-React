import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import "../style.css";
import "./market.css";
import { useSelector } from "react-redux";
import { useAuth } from "../utils/utils";

import ProductBox from "../componets/productBox";
import { useNavigate } from "react-router-dom";

export default function Mypage() {
  const [myProduct, setMyProduct] = useState([]);
  const [myWish, setMyWish] = useState([]);
  const { username, userUid } = useSelector((state) => state.auth);
  const nav = useNavigate();

  if (userUid == "") {
    alert("로그인을 해주세요.");
    nav("/login");
  }
  useAuth();

  useEffect(() => {
    //product 컬렉션에서 sellerUid가  userUid와 같은  문서들을 가져온다.
    const productRef = query(
      collection(db, "product"),
      where("sellerUid", "==", userUid)
    );
    const getMyProduct = getDocs(productRef);
    getMyProduct.then((data) => {
      setMyProduct(data.docs);
    });

    const wishRef = query(
      collection(db, "product"),
      where("likeUid", "array-contains", userUid)
    );

    getDocs(wishRef).then((data) => {
      setMyWish(data.docs);
    });

    //userUid가 업데이트 후 훅이 실행되게 설정
    // userUid 값을 받은 후 훅이  실행되어야 쿼리를 제대로 할 수 있다
    // userUid가 업데이트 되지 않은 상태로 훅이 실행하면 data.docs는 빈 배열이 된다. user에 userUid와 같은 문서가 없기 때문
  }, [userUid]);

  return (
    <>
      <main>
        <div className="product-warp">
          <h1>{username}의 마이 페이지</h1>
          <h2>내 상품</h2>
          <div className="product-container">
            {myProduct.map((data) => {
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
        <div className="product-warp">
          <h1> 찜한 상품</h1>
          <div className="product-container">
            {myWish.map((data) => {
              return <ProductBox data={data} />;
            })}
          </div>
        </div>
      </main>
    </>
  );
}
