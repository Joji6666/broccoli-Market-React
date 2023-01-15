import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { async } from "q";

import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";

export default function Upload() {
  const auth = getAuth();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [content, setContent] = useState("");
  const [seller, setSeller] = useState("");
  const [sellerUid, setSellerUid] = useState("");

  const imageFilesHandler = (e) => {
    const imageFiles = e.target.files;
    setImage(imageFiles);
    console.log(imageFiles);
  };

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

  const imageUrl = [];

  const upload = async () => {
    // 유사 배열에 반복문 활용하는법
    await [].map.call(image, async (data) => {
      //이미지 업로드 코드             스토리지에 어떤곳에 저장하고 무슨 이름으로 저장할지
      const storageRef = ref(storage, `image/${data.name}`);
      console.log(storageRef);

      // 올릴곳       올릴 파일
      await uploadBytes(storageRef, image).then(async (snapshot) => {
        //파일 url 가져오기
        await getDownloadURL(snapshot.ref).then(async (url) => {
          console.log("업로드 된 경로는", url);
          await imageUrl.push(url);

          console.log(imageUrl);
        });
      });
    });

    await Promise.all();
  };

  addDoc(collection(db, "product"), {
    title,
    price,
    content,
    imageUrl,
    seller,
    sellerUid,
    date: new Date(),
  }).then(() => {
    console.log("파일 업로드 완료");
  });

  const upload2 = () => {
    addDoc(collection(db, "product"), {
      title,
      price,
      content,
      imageUrl,
      seller,
      sellerUid,
      date: new Date(),
    }).then(() => {
      console.log("파일 업로드 완료");
    });
  };

  return (
    <div>
      Upload
      <input
        type="text"
        id="title"
        placeholder="상품 제목을 입력해주세요."
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <input
        type="text"
        id="price"
        placeholder="상품 가격을 입력해주세요."
        onChange={(e) => {
          setPrice(e.target.value);
        }}
      />
      <input
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
      <button onClick={upload}>이미지 업로드</button>
      <button onClick={upload2}>파일 업로드</button>
    </div>
  );
}