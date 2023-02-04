import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";

import { auth, db } from "../firebase";
import "../style.css";
import "./market.css";

import "react-toastify/dist/ReactToastify.css";
import Search from "../componets/search";
import { useSelector, useDispatch } from "react-redux";
import { setUserName, setUserUid, setFilteredProduct } from "../store";
import { handelKeyPress } from "../utils/utils";
import ProductBox from "../componets/productBox";

export default function Market() {
  const [product, setProduct] = useState([]);

  const [serachTag, setSerachTag] = useState("");
  const { filteredProduct } = useSelector((state) => state.filteredProduct);
  const { userUid } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    //로그인 상태 관리 코드
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUserName(user.displayName));
        dispatch(setUserUid(user.uid));
        console.log(user);
      }
    });
  }, []);

  useEffect(() => {
    // product 시간순 정렬 후 가져오기
    const productRef = collection(db, "product");
    const q = query(productRef, orderBy("date", "asc"));

    getDocs(q).then((data) => {
      setProduct(data.docs);
    });
  }, [userUid]);

  // useDidMountEffect(async () => {
  //   const productRef = doc(db, "product", productId);

  //   // 찜 버튼을 누른 product  문서를 가져온다.
  //   const getProduct = getDoc(productRef);
  //   getProduct.then(async (data) => {
  //     const islike = data.data().likeUid;

  //     //includes 는 배열에서 특정 요소가 있는지 확인한다. 있으면 true 없으면 false를 반환한다.
  //     if (islike && islike.includes(userUid)) {
  //       await updateDoc(productRef, {
  //         // arrayRemove는 배열에 특정 요소를 삭제하는 메소드다.
  //         like: arrayRemove(username),
  //         likeUid: arrayRemove(userUid),
  //       });

  //       toast.success("찜이 삭제 됐습니다.");
  //       console.log("찜 삭제");
  //     } else {
  //       await updateDoc(productRef, {
  //         // arrayUnion 배열에 요소를 추가하지만 아직 존재하지 않는 요소만 추가한다. 즉 기존의 like,likeUid 필드에 새로운 찜한사람 값을 넣을 수 있는것
  //         like: arrayUnion(username),
  //         likeUid: arrayUnion(userUid),
  //       });

  //       toast.success("찜 하였습니다.");
  //       console.log("찜목록 추가");
  //     }
  //   });
  //   await setProductId("");

  //   return () => {
  //     setProductId(productId);
  //   };
  // }, [productId]);

  const handleSearch = async () => {
    // filteredProducts를 갱신하는 코드
    const filteredProducts = product.filter((p) => {
      //tag 가 존재하거나 상품제목이 검색어와 일치하면 필터링
      if (p.data().tag || p.data().title) {
        return (
          p
            .data()
            // some 함수를 사용하여 하나 이상의 태그가 검색어와 일치하는지 확인
            .tag.some((t) =>
              t.toLowerCase().includes(serachTag.toLowerCase())
            ) || p.data().title.toLowerCase().includes(serachTag.toLowerCase())
        );
      }
    });

    await dispatch(setFilteredProduct(filteredProducts));
  };

  const search = async () => {
    await handleSearch();
  };

  return (
    <>
      <main>
        {filteredProduct.length > 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              style={{
                border: "none",
                backgroundColor: "green",
                borderRadius: "5px",
                cursor: "pointer",
                margin: "10px",
              }}
              onClick={() => {
                dispatch(setFilteredProduct([]));
              }}
            >
              <svg
                className="backArrow"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
              </svg>
            </button>

            <Search />
          </div>
        ) : (
          <div className="product-warp">
            <h1>상품 목록</h1>
            <div style={{ display: "flex", alignItems: "center" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="search-icon"
              >
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z" />
              </svg>
              <input
                className="search-input"
                type="text"
                placeholder="검색할 상품을 입력해주세요."
                onChange={(e) => {
                  setSerachTag(e.target.value);
                }}
                onKeyPress={(e) => handelKeyPress(e, handleSearch)}
              ></input>

              <button className="search-btn" onClick={search}>
                검색
              </button>
            </div>

            <div className="product-container">
              {product && product.length > 0 ? (
                product.map((data) => {
                  return <ProductBox data={data} />;
                })
              ) : (
                <h1>상품 불러오는중...</h1>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
