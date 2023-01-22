import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import "../style.css";
import "./detail.css";

export default function Detail() {
  const auth = getAuth();
  const [productData, setProductData] = useState("");
  const [productId, setProductId] = useState("");
  const [productImage, setProductImage] = useState([]);
  const [username, setUserName] = useState("");
  const [userUid, setUserUid] = useState("");
  const [sellerUid, setSellerUid] = useState("");
  const [display, setDisplay] = useState("");
  const [joinChatRoomDisplay, setJoinChatRoomDisplay] = useState("");
  const [joinChatRoomSwitch, setJoinChatRoomSwitch] = useState(false);
  const [chatRoomData, setChatRoomData] = useState([]);

  const nav = useNavigate();

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
    //              market 컴포넌트에서 Link를 이용하여 url에 업로드 된 문서의 id를 입력받도록했다.
    //                       url 에서 id값 가져오는 코드
    const query = new URLSearchParams(window.location.search);

    const docRef = doc(db, "product", query.get("id"));

    const getProduct = getDoc(docRef);
    getProduct.then(async (data) => {
      console.log(data.data());
      setProductData(data.data());
      setProductImage(data.data().imageUrl);
      setSellerUid(data.data().sellerUid);
      setProductId(data.id);
    });
  }, []);
  console.log(productImage);
  console.log(productData);
  console.log(productId);

  useEffect(() => {
    if (userUid == sellerUid) {
      setDisplay("inline");
      setJoinChatRoomDisplay("none");
    } else {
      setDisplay("none");
      setJoinChatRoomDisplay("inline");
    }
  }, [productData]);

  const q = new URLSearchParams(window.location.search);
  //채팅방 컬렉션에 문서 추가 코드
  const joinChatRoom = async () => {
    const queryChatRoom = query(
      collection(db, "chatroom"),
      where("user", "in", [[sellerUid, userUid]]),
      where("productId", "==", productId)
    );

    const getChatRoom = getDocs(queryChatRoom);

    await getChatRoom.then((data) => {
      // 판매자와 내 uid가 포함돼어있는 채팅방이 있으면
      // data.docs.length는 1이 되므로 채팅방으로 이동한다.
      // 채팅방이 없으면 채팅방을 생성한다.
      if (data.docs.length > 0) {
        console.log("채팅방 존재");
        nav("/chat");
      } else {
        console.log("채팅방 없음");
        addDoc(collection(db, "chatroom"), {
          user: [productData.sellerUid, userUid],
          username: [productData.seller, username],
          productTitle: productData.title,
          date: new Date().toString(),
          productId: q.get("id"),
        }).then(() => {
          console.log("채팅방 생성");
          nav("/chat");
        });
      }
    });
  };

  const deleteProduct = () => {
    const deleteConfirm = window.confirm("정말 삭제하시겠습니까?");

    if (deleteConfirm === true) {
      deleteDoc(doc(db, "product", q.get("id"))).then(() => {
        alert("삭제됐습니다.");
        nav("/market");
      });
    }
  };

  return (
    <>
      <div className="detail-product-container">
        <h1>상품 상세 페이지</h1>
        <div className="detail-wrap">
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
          <div className="content-box">
            <span className="content">상품 설명:{productData.content}</span>
            <span className="title">상품명:{productData.title}</span>

            <span className="price">상품 가격:{productData.price}</span>

            <span className="seller">판매자:{productData.seller}</span>
            <span className="date">작성 날짜:{productData.date}</span>
          </div>
          <button
            className="joinChat-btn"
            style={{ display: joinChatRoomDisplay }}
            onClick={joinChatRoom}
          >
            채팅
          </button>
          <Link to={`/edit?id=${productId}`}>
            <button style={{ display: display }}>수정</button>
          </Link>
          <button onClick={deleteProduct} style={{ display: display }}>
            삭제
          </button>
        </div>
      </div>
    </>
  );
}
