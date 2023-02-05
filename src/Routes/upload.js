import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ImgUploadInput from "../componets/imgUploadInput";
import UploadingBar from "../componets/uploadingBar";
import UploadInput from "../componets/uploadInput";
import { db, storage } from "../firebase";

import "../style.css";
import { useAuth } from "../utils/utils";
import "./upload.css";

export default function Upload() {
  const nav = useNavigate();
  const [image, setImage] = useState(null);
  const [tag, setTag] = useState([]);
  const [imgFile, setImgFile] = useState([]);
  const [imgCount, setImgCount] = useState(0);
  const uploadRef = useRef();

  const { title, price, content } = useSelector((state) => state.uploadData);

  const { username, userUid } = useSelector((state) => state.auth);

  if (userUid == "") {
    alert("로그인을 해주세요.");
    nav("/login");
  }
  useAuth();

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
    addDoc(collection(db, "product"), {
      title,
      price,
      content,
      imageUrl,
      seller: username,
      sellerUid: userUid,
      like: [],
      likeUid: [],
      tag,
      date: new Date().toLocaleString(),
    }).then((result) => {
      console.log(result);
      console.log("업로드완료");
      alert("업로드 됐습니다.");
      nav("/mypage");
    });
  };

  const upload = async () => {
    uploadRef.current.style = "display:block";
    try {
      await imgUpload();

      await setProduct();
      console.log("업로드완료");
    } catch {
      console.log("업로드 실패");
    }
  };

  return (
    <>
      <UploadingBar uploadRef={uploadRef} />

      <div className="upload-container">
        <h1 style={{ margin: 0 }}>상품 업로드</h1>
        <div className="upload-box">
          <div className="image-upload-box">
            <ImgUploadInput
              imgCount={imgCount}
              setImgCount={setImgCount}
              image={image}
              setImage={setImage}
              setImgFile={setImgFile}
            />

            <div className="preview-image-box">
              {/* imaFile를 순회하며 각 이미지를 렌더링 */}
              {imgFile.map((image, index) => (
                <img
                  onClick={() => {
                    setImgFile(imgFile.filter((images) => images !== image));
                    setImgCount(imgCount - 1);
                  }}
                  id="preview-img"
                  key={index}
                  src={image}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>
          </div>
          <UploadInput
            tag={tag}
            setTag={setTag}
            titleDefaultValue={""}
            priceDefaultValue={""}
            contentDefaultValue={""}
          />

          <button id="upload-btn" onClick={upload}>
            업로드
          </button>
        </div>
      </div>
    </>
  );
}
