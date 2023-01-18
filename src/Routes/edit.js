import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";

export default function Edit() {
  const auth = getAuth();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [content, setContent] = useState("");
  const [seller, setSeller] = useState("");
  const [sellerUid, setSellerUid] = useState("");
  const [productData, setProductData] = useState("");

  const imageFilesHandler = (e) => {
    const imageFiles = e.target.files;
    setImage(imageFiles);
    console.log(imageFiles);
  };

  const query = new URLSearchParams(window.location.search);

  const docRef = doc(db, "product", query.get("id"));

  useEffect(() => {
    //로그인 상태 관리 코드
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSeller(user.displayName);
        setSellerUid(user.uid);
        console.log(user);
      }
    });
  }, []);

  useEffect(() => {
    const getProduct = getDoc(docRef);
    getProduct.then((data) => {
      setProductData(data.data());
      console.log(data.data());
    });
  }, [sellerUid]);

  const imageUrl = [];

  // for of 방식
  const imgUpload = async () => {
    for (const forImage of image) {
      const storageRef = await ref(storage, `image/${forImage.name}`);
      console.log(storageRef);

      //             올릴곳     올릴 파일
      await uploadBytes(storageRef, forImage).then(async (snapshot) => {
        //파일 url 가져오기
        await getDownloadURL(snapshot.ref).then(async (url) => {
          console.log("업로드 된 경로는", url);
          await imageUrl.push(url);
          console.log(imageUrl);
        });
      });
    }
  };

  const setProduct = async () => {
    console.log(imageUrl);
    updateDoc(docRef, {
      title,
      price,
      content,
      imageUrl,
      seller,
      sellerUid,

      date: new Date().toString(),
    }).then((result) => {
      console.log(result);
      console.log("수정 완료");
    });
  };

  const upload = async () => {
    try {
      await imgUpload();

      await setProduct();
      console.log("업로드완료");
    } catch {
      console.log("업로드 실패");
    }
  };

  return (
    <div>
      Edit
      <input
        defaultValue={productData.title}
        type="text"
        id="title"
        placeholder="상품 제목을 입력해주세요."
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <input
        defaultValue={productData.price}
        type="text"
        id="price"
        placeholder="상품 가격을 입력해주세요."
        onChange={(e) => {
          setPrice(e.target.value);
        }}
      />
      <input
        defaultValue={productData.content}
        type="text"
        id="content"
        placeholder="상품 내용을 입력해주세요."
        onChange={(e) => {
          setContent(e.target.value);
        }}
      />
      <input
        type="file"
        id="image"
        placeholder="이미지를 업로드 해주세요."
        multiple
        onChange={imageFilesHandler}
      />
      <button onClick={upload}>업로드</button>
    </div>
  );
}
