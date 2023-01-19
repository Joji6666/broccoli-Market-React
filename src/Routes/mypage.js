import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";

import { db } from "../firebase";
import { Link } from "react-router-dom";
import "../style.css";

export default function Mypage() {
  const auth = getAuth();
  const [username, setUserName] = useState("");
  const [userUid, setUserUid] = useState("");
  const [myProduct, setMyProduct] = useState([]);
  const [myWish, setMyWish] = useState([]);

  useEffect(() => {
    //로그인 상태 관리 코드
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName);
        setUserUid(user.uid);
        console.log(user);
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
      <h1>마이페이지</h1>
      <div>내 상품</div>
      {myProduct.map((data) => {
        return (
          <>
            <Link to={`/detail?id=${data.id}`}>
              <div
                className="thumbnail"
                style={{ backgroundImage: `url(${data.data().imageUrl[0]})` }}
              ></div>
              <div>상품명:{data.data().title}</div>
              <div>상품가격:{data.data().price}</div>
            </Link>
          </>
        );
      })}
      <div>찜목록</div>
      {myWish.map((data) => {
        return (
          <>
            <Link to={`/detail?id=${data.id}`}>
              <div
                className="thumbnail"
                style={{ backgroundImage: `url(${data.data().imageUrl[0]})` }}
              ></div>
              <div>상품명:{data.data().title}</div>
              <div>상품가격:{data.data().price}</div>
            </Link>
          </>
        );
      })}
    </>
  );
}
