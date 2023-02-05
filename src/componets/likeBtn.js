import React from "react";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { db } from "../firebase";

import "../Routes/market.css";
import wishlist from "../wishlist.png";
import { useNavigate } from "react-router-dom";

export default function LikeBtn(props) {
  const { username, userUid } = useSelector((state) => state.auth);
  const productRef = doc(db, "product", props.productId);
  const nav = useNavigate();
  const handleLike = async () => {
    if (userUid) {
      // 찜 버튼을 누른 product  문서를 가져온다.
      const getProduct = getDoc(productRef);
      getProduct.then(async (data) => {
        const islike = data.data().likeUid;
        //includes 는 배열에서 특정 요소가 있는지 확인한다. 있으면 true 없으면 false를 반환한다.
        if (islike && islike.includes(userUid)) {
          await updateDoc(productRef, {
            // arrayRemove는 배열에 특정 요소를 삭제한다.
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
    } else {
      alert("로그인을 해주세요.");
      nav("/login");
    }
  };

  return (
    <div
      onClick={() => {
        handleLike();
      }}
      className="wish"
    >
      <img className="wish-logo" src={wishlist} />
    </div>
  );
}
