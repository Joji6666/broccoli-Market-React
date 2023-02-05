import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ImgUploadInput from "../componets/imgUploadInput";
import UploadingBar from "../componets/uploadingBar";
import UploadInput from "../componets/uploadInput";
import { auth, db, storage } from "../firebase";
import {
  setContent,
  setPrice,
  setTitle,
  setUserName,
  setUserUid,
} from "../store";
import "../style.css";
import "./upload.css";
export default function Edit() {
  const nav = useNavigate();
  const [image, setImage] = useState(null);
  const [productData, setProductData] = useState("");

  const [tag, setTag] = useState([]);
  const [imgFile, setImgFile] = useState([]);
  const [uploadedUrl, setUploadedUrl] = useState([]);
  const [imgCount, setImgCount] = useState(0);

  const { title, price, content } = useSelector((state) => state.uploadData);
  const { username, userUid } = useSelector((state) => state.auth);

  const query = new URLSearchParams(window.location.search);
  const uploadRef = useRef();
  const docRef = doc(db, "product", query.get("id"));
  const getProduct = getDoc(docRef);
  const imageUrl = [];
  const dispatch = useDispatch();

  useEffect(() => {
    //로그인 상태 관리 코드
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUserName(user.displayName));
        dispatch(setUserUid(user.uid));
      }
    });
    getProduct.then((data) => {
      setProductData(data.data());
    });
  }, []);

  useEffect(() => {
    if (productData.tag) {
      productData.tag.map((data) => {
        setTag((tags) => [...tags, data]);
      });
    }

    if (productData.imageUrl) {
      productData.imageUrl.map((data) => {
        setUploadedUrl((images) => [...images, data]);
        imageUrl.push(data);
      });
      setImgCount(productData.imageUrl.length);
      dispatch(setTitle(productData.title));
      dispatch(setContent(productData.content));
      dispatch(setPrice(productData.price));
    }
  }, [productData]);

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
    if (image === null) {
      updateDoc(docRef, {
        title,
        price,
        content,
        imageUrl: uploadedUrl,
        seller: username,
        sellerUid: userUid,

        tag,
        date: new Date().toString(),
      }).then((result) => {
        console.log(result);
        console.log("수정 완료");
        alert("수정됐습니다.");
        nav("/mypage");
      });
    } else {
      //기존에 업로드 된 이미지 url과 새로 업로드하는 이미지 url을 합쳐서 업데이트
      const allImagesUrl = uploadedUrl.concat(imageUrl);

      console.log(imageUrl);
      updateDoc(docRef, {
        title,
        price,
        content,
        imageUrl: allImagesUrl,
        seller: username,
        sellerUid: userUid,

        tag,
        date: new Date().toString(),
      }).then((result) => {
        console.log(result);
        console.log("수정 완료");
        alert("수정됐습니다.");
        nav("/mypage");
      });
    }
  };

  const upload = async () => {
    try {
      if (image === null) {
        uploadRef.current.style = "display:block";
        setProduct();
      } else {
        uploadRef.current.style = "display:block";
        await imgUpload();

        await setProduct();
        console.log("업로드완료");
      }
    } catch {
      console.log("업로드 실패");
    }
  };

  return (
    <>
      <UploadingBar uploadRef={uploadRef} />
      <div className="upload-container">
        <h1 style={{ margin: 0 }}>상품 수정</h1>
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
              {uploadedUrl.map((url, index) => {
                return (
                  <img
                    onClick={() => {
                      setUploadedUrl(
                        uploadedUrl.filter((images) => images !== url)
                      );
                      setImgCount(imgCount - 1);
                      console.log(imgCount);
                    }}
                    id="preview-img"
                    key={index}
                    src={url}
                    style={{ cursor: "pointer" }}
                  />
                );
              })}
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
            titleDefaultValue={productData.title}
            priceDefaultValue={productData.price}
            contentDefaultValue={productData.content}
          />

          <button id="upload-btn" onClick={upload}>
            수정
          </button>
        </div>
      </div>
    </>
  );
}
