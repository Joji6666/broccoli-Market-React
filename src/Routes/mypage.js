import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";

import { db } from "../firebase";
import { Link } from "react-router-dom";
import "../style.css";
import "./market.css";
import { useNavigate } from "react-router-dom";

export default function Mypage() {
  const auth = getAuth();
  const [username, setUserName] = useState("");
  const [userUid, setUserUid] = useState("");
  const [myProduct, setMyProduct] = useState([]);
  const [myWish, setMyWish] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    //로그인 상태 관리 코드
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName);
        setUserUid(user.uid);
        console.log(user);
      } else {
        alert("로그인을 해주세요.");
        nav("/login");
      }
    });
  }, []);

  useEffect(() => {
    //product 컬렉션에서 sellerUid가  userUid와 같은  문서들을 가져온다.
    const productRef = query(
      collection(db, "product"),
      where("sellerUid", "==", userUid)
    );
    const getMyProduct = getDocs(productRef);
    getMyProduct.then((data) => {
      // 가져온 문서 배열들을 chatroom에 저장
      setMyProduct(data.docs);
      console.log(data.docs);
      console.log(myProduct);
    });

    const wishRef = query(
      collection(db, "product"),
      where("likeUid", "array-contains", userUid)
    );

    getDocs(wishRef).then((data) => {
      console.log(data.docs);
      setMyWish(data.docs);
    });

    //userUid가 업데이트 후 훅이 실행되게 설정
    // userUid 값을 받은 후 훅이  실행되어야 쿼리를 제대로 할 수 있다
    // userUid가 업데이트 되지 않은 상태로 훅이 실행하면 data.docs는 빈 배열이 된다. user에 userUid와 같은 문서가 없기 때문
  }, [userUid]);

  return (
    <>
      <main>
        <span>마이페이지</span>
        <div className="product-warp">
          <h1>내 상품</h1>
          <div className="product-container">
            {myProduct.map((data) => {
              // const likeUid = data.data().likeUid;
              // let wish = "🤍";
              // if (likeUid && likeUid.includes(userUid)) {
              //   wish = "❤️";
              // }

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
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <main>
        <div className="product-warp">
          <h1>내가 찜한 상품</h1>
          <div className="product-container">
            {myWish.map((data) => {
              // const likeUid = data.data().likeUid;
              // let wish = "🤍";
              // if (likeUid && likeUid.includes(userUid)) {
              //   wish = "❤️";
              // }

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
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
