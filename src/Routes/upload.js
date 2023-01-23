import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../firebase";
import "../style.css";
import "./upload.css";

export default function Upload() {
  const auth = getAuth();
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [content, setContent] = useState("");
  const [seller, setSeller] = useState("");
  const [sellerUid, setSellerUid] = useState("");
  const [tagValue, setTagValue] = useState("");
  const [tag, setTag] = useState([]);
  const [imgFile, setImgFile] = useState([]);

  const imgRef = useRef();

  const handleClick = () => {
    // keywords 배열의 길이가 5보다 작은 경우만 추가
    if (tag.length < 5) {
      setTag((tags) => [...tags, tagValue]);
    } else {
      alert("연관검색어는 최대 5개까지 추가 가능합니다.");
    }
  };

  const imageFilesHandler = (e) => {
    const imageFiles = e.target.files;
    setImage(imageFiles);
    console.log(imageFiles);

    if (imageFiles.length > 10) {
      alert("이미지는 최대 10장 까지 업로드 가능합니다.");
      setImage(null);
      e.target.value = null;
    } else {
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

  useEffect(() => {
    //로그인 상태 관리 코드
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSeller(user.displayName);
        setSellerUid(user.uid);
        console.log(user);
      } else {
        alert("로그인을 해주세요.");
        nav("/login");
      }
    });
  }, []);

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

  //mpa+Promise.all 방식
  // 이미지 들이 순서대로 업데이트 되지 않는다.

  // const imgUpload2 = async () => {
  //   await Promise.all(
  //     // 유사 배열에 반복문 활용하는법

  //     await [].map.call(image, async (data) => {
  //       //이미지 업로드 코드             스토리지에 어떤곳에 저장하고 무슨 이름으로 저장할지
  //       const storageRef = await ref(storage, `image/${data.name}`);
  //       console.log(storageRef);

  //       //             올릴곳     올릴 파일
  //       await uploadBytes(storageRef, data).then(async (snapshot) => {
  //         //파일 url 가져오기
  //         await getDownloadURL(snapshot.ref).then(async (url) => {
  //           console.log("업로드 된 경로는", url);
  //           await imageUrl.push(url);
  //           console.log(imageUrl);
  //         });
  //       });
  //     })
  //   );
  // };

  const setProduct = async () => {
    console.log(imageUrl);
    addDoc(collection(db, "product"), {
      title,
      price,
      content,
      imageUrl,
      seller,
      sellerUid,
      like: [],
      likeUid: [],
      tag,
      date: new Date().toString(),
    }).then((result) => {
      console.log(result);
      console.log("업로드완료");
      alert("업로드 됐습니다.");
      nav("/mypage");
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
    <>
      <h1 style={{ margin: 0 }}>상품 업로드</h1>
      <div className="upload-container">
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
            <input
              ref={imgRef}
              accept="image/*"
              required
              type="file"
              id="image"
              placeholder="이미지를 업로드 해주세요."
              multiple
              onChange={imageFilesHandler}
            />
            <div className="preview-image-box">
              {/* imaFile를 순회하며 각 이미지를 렌더링 */}
              {imgFile.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  style={{
                    width: "100px",
                    height: "100px",
                    margin: "5px",
                  }}
                />
              ))}
            </div>
          </div>
          <input
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
              placeholder="상품과 연간된 태그를 입력해주세요."
              onChange={(e) => {
                setTagValue(e.target.value);
              }}
            />
            태그:
            {tag.map((data, index) => (
              <div key={index}>{data}</div>
            ))}
            <button id="addTag-btn" onClick={handleClick}>
              태그 추가하기
            </button>
          </div>
          <input
            required
            type="text"
            id="price"
            placeholder="상품 가격을 입력해주세요."
            onChange={(e) => {
              setPrice(e.target.value);
            }}
          />
          <input
            required
            type="text"
            id="content"
            placeholder="상품 내용을 입력해주세요."
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />

          <button onClick={upload}>업로드</button>
        </div>
      </div>
    </>
  );
}
