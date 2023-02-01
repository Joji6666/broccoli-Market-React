import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import "../style.css";

import "./upload.css";
export default function Edit() {
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [content, setContent] = useState("");
  const [seller, setSeller] = useState("");
  const [sellerUid, setSellerUid] = useState("");
  const [productData, setProductData] = useState("");
  const [tagValue, setTagValue] = useState("");
  const [tag, setTag] = useState([]);
  const [imgFile, setImgFile] = useState([]);
  const [uploadedUrl, setUploadedUrl] = useState([]);
  const [imgCount, setImgCount] = useState(0);

  const imgRef = useRef();
  const uploadRef = useRef();
  const query = new URLSearchParams(window.location.search);

  const docRef = doc(db, "product", query.get("id"));
  const getProduct = getDoc(docRef);
  const imageUrl = [];

  useEffect(() => {
    //로그인 상태 관리 코드
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSeller(user.displayName);
        setSellerUid(user.uid);
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
      setTitle(productData.title);
      setContent(productData.content);
      setPrice(productData.price);
    }
  }, [productData]);

  const handleClick = () => {
    // tag 배열의 길이가 5보다 작은 경우만 추가
    if (tag.length < 5) {
      setTag((tags) => [...tags, tagValue]);
    } else {
      alert("연관검색어는 최대 5개까지 추가 가능합니다.");
    }
  };

  const imageFilesHandler = (e) => {
    const imageFiles = e.target.files;

    console.log(imageFiles);
    console.log(imgCount);
    if (imgCount + imageFiles.length > 10) {
      alert("이미지는 최대 10장 까지 업로드 가능합니다.");

      return;
    } else {
      setImgCount(imgCount + e.target.files.length);
      // image state의 값이 null 인 경우, imageFiles로 대체하고,
      // 그렇지 않은 경우 기존 image 값을 유지하면서 imageFiles를 추가
      setImage(image === null ? imageFiles : [...image, ...imageFiles]);
      console.log(image);
    }

    // 이미지 미리보기 코드
    // imageFiles를 반복문으로 순회하며 각 파일들을 읽어들임
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];

      const reader = new FileReader();

      // 파일 읽기 시작
      reader.readAsDataURL(file);

      // onloadend 이벤트 핸들러를 설정, 이미지를 읽어들인 후 imgFile를 업데이트

      reader.onloadend = () => {
        //         result 에는 readAsDataURL을 이용하여 가져온 값이 들어있다.
        setImgFile((prevImages) => [...prevImages, reader.result]);
      };
    }
  };

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
        seller,
        sellerUid,

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
        seller,
        sellerUid,

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
      <div
        ref={uploadRef}
        className="uploading-box"
        style={{ display: "none" }}
      >
        <div className="animation-box">
          <h1 data-text="uploading">uploading</h1>
        </div>
      </div>

      <div className="upload-container">
        <h1 style={{ margin: 0 }}>상품 수정</h1>
        <div className="upload-box">
          <div className="image-upload-box">
            <span
              style={{
                fontSize: "13px",
                color: "gray",
                float: "left",
                margin: "10px",
              }}
            >
              최소 1장의 이미지를 업로드 해주세요.
            </span>
            <label for="file">
              <input
                className="image-upload-input"
                ref={imgRef}
                accept="image/*"
                required
                type="file"
                id="file"
                placeholder="이미지를 업로드 해주세요."
                multiple
                onChange={imageFilesHandler}
              />
              <div class="image-upload-btn">이미지 업로드하기</div>
            </label>

            <div className="preview-image-box">
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
            </div>
          </div>
          <input
            defaultValue={productData.title}
            required
            type="text"
            id="title"
            placeholder="상품 제목을 입력해주세요."
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <div className="tag-box">
            <input
              required
              type="text"
              id="tag"
              maxlength="10"
              placeholder="상품과 연관된 태그를 입력해주세요. 최대 5개"
              onChange={(e) => {
                setTagValue(e.target.value);
              }}
            />
            <span style={{ fontSize: "13px" }}>태그:</span>

            <div style={{ display: "flex" }}>
              {tag.map((data, index) => (
                <div
                  className="tags"
                  onClick={() => {
                    setTag(tag.filter((tags) => tags !== data));
                  }}
                  key={index}
                >
                  #{data}
                </div>
              ))}
            </div>
            {tagValue !== "" ? (
              <button id="addTag-btn" onClick={handleClick}>
                태그 추가
              </button>
            ) : null}
          </div>
          <input
            defaultValue={productData.price}
            required
            type="text"
            id="price"
            placeholder="상품 가격을 입력해주세요."
            onChange={(e) => {
              setPrice(e.target.value);
            }}
          />
          <input
            defaultValue={productData.content}
            required
            type="text"
            id="content"
            placeholder="상품 내용을 입력해주세요."
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />

          <button id="upload-btn" onClick={upload}>
            수정
          </button>
        </div>
      </div>
    </>
  );
}
