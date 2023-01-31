import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";
import "../style.css";
import "./detail.css";
import "react-toastify/dist/ReactToastify.css";

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
      //chatroom 컬렉션안에서
      collection(db, "chatroom"),
      // user 필드에 내 uid와 판매자uid가 포함된 현재 상품id를 가진 문서를 가져온다,
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

  const likehandle = async () => {
    const productRef = doc(db, "product", productId);

    // 찜 버튼을 누른 product  문서를 가져온다.
    const getProduct = getDoc(productRef);
    getProduct.then(async (data) => {
      const islike = data.data().likeUid;

      //includes 는 배열에서 특정 요소가 있는지 확인한다. 있으면 true 없으면 false를 반환한다.
      if (islike && islike.includes(userUid)) {
        await updateDoc(productRef, {
          // arrayRemove는 배열에 특정 요소를 삭제하는 메소드다.
          like: arrayRemove(username),
          likeUid: arrayRemove(userUid),
        });

        alert("찜이 삭제 됐습니다.");
        console.log("찜 삭제");
      } else {
        await updateDoc(productRef, {
          // arrayUnion 배열에 요소를 추가하지만 아직 존재하지 않는 요소만 추가한다. 즉 기존의 like,likeUid 필드에 새로운 찜한사람 값을 넣을 수 있는것
          like: arrayUnion(username),
          likeUid: arrayUnion(userUid),
        });

        alert("찜 하였습니다.");
        console.log("찜목록 추가");
      }
    });
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
            <span className="price">상품 가격:{productData.price}원</span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              태그:
              {productData
                ? productData.tag.map((data) => {
                    return (
                      <span
                        style={{
                          border: "none",
                          fontSize: "12px",
                          backgroundColor: "gray",
                          borderRadius: "5px",
                          padding: "2px",
                        }}
                      >
                        #{data}
                      </span>
                    );
                  })
                : null}
            </div>
            <span className="seller">판매자:{productData.seller}</span>
            <span className="date">작성 날짜:{productData.date}</span>
          </div>
          <div className="btn-box">
            <button
              className="joinChat-btn"
              style={{ display: joinChatRoomDisplay }}
              onClick={joinChatRoom}
            >
              채팅
            </button>
            <Link
              style={{ textDecoration: "none" }}
              to={`/edit?id=${productId}`}
            >
              <button style={{ display: display, backgroundColor: "green" }}>
                수정
              </button>
            </Link>
            <button
              onClick={deleteProduct}
              style={{ display: display, backgroundColor: "red" }}
            >
              삭제
            </button>
            <button style={{ backgroundColor: "red" }} onClick={likehandle}>
              찜하기
            </button>
            <ToastContainer
              position="bottom-center"
              autoClose={1000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={true}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </div>
        </div>
      </div>
    </>
  );
}
