import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import "../style.css";

export default function Detail() {
  const auth = getAuth();
  const [productData, setProductData] = useState("");
  const [productImage, setProductImage] = useState([]);
  const [username, setUserName] = useState("");
  const [userUid, setUserUid] = useState("");

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
    //                       url 에서 id값 가져오는 코드
    const query = new URLSearchParams(window.location.search);

    const docRef = doc(db, "product", query.get("id"));
    const getProduct = getDoc(docRef);
    getProduct.then((data) => {
      console.log(data.data());
      setProductData(data.data());
      setProductImage(data.data().imageUrl);
    });
  }, []);
  console.log(productImage);
  console.log(productData);

  const query = new URLSearchParams(window.location.search);
  const joinChatRoom = () => {
    addDoc(collection(db, "chatroom"), {
      user: [productData.sellerUid, userUid],
      username: [productData.seller, username],
      productTitle: productData.title,
      date: new Date().toString(),
      productId: query.get("id"),
    });
  };

  return (
    <>
      <h1>상세페이지</h1>
      <div className="detail-product-container">
        <div className="image-container">
          {productImage.map((data) => {
            return (
              <>
                <div className="detail-image">
                  <img src={data} />
                </div>
              </>
            );
          })}
        </div>
        <div className="content">{productData.content}</div>
        <div className="title">{productData.title}</div>

        <div className="price">{productData.price}</div>

        <div className="seller">{productData.seller}</div>
        <div className="date">{productData.date}</div>
      </div>
      <button onClick={joinChatRoom}>채팅</button>
    </>
  );
}
