import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { db } from "../firebase";
import "../style.css";
import useDidMountEffect from "../usedidmounteffect";
import "react-toastify/dist/ReactToastify.css";
import wishlist from "../wishlist.png";

export default function Market() {
  const [product, setProduct] = useState([]);
  const [productId, setProductId] = useState("");
  const auth = getAuth();
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
    getDocs(collection(db, "product")).then((data) => {
      setProduct(data.docs);
    });
  }, [userUid]);

  useDidMountEffect(async () => {
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

        toast.success("찜이 삭제 됐습니다.");
        console.log("찜 삭제");
      } else {
        await updateDoc(productRef, {
          // arrayUnion 배열에 요소를 추가하지만 아직 존재하지 않는 요소만 추가한다. 즉 기존의 like,likeUid 필드에 새로운 찜한사람 값을 넣을 수 있는것
          like: arrayUnion(username),
          likeUid: arrayUnion(userUid),
        });

        toast.success("찜 하였습니다.");
        console.log("찜목록 추가");
      }
    });
    await setProductId("");

    return () => {
      setProductId(productId);
    };
  }, [productId]);

  return (
    <>
      <h1>상세페이지</h1>

      {product.map((data) => {
        // const likeUid = data.data().likeUid;
        // let wish = "🤍";
        // if (likeUid && likeUid.includes(userUid)) {
        //   wish = "❤️";
        // }

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
            <div
              onClick={() => {
                setProductId(data.id);
              }}
              className="wish"
            >
              <img src={wishlist} />
            </div>
          </div>
        );
      })}
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
    </>
  );
}
