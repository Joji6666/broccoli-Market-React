import React from "react";

export default function ImgUploadInput(props) {
  const imageFilesHandler = (e) => {
    const imageFiles = e.target.files;

    console.log(imageFiles);
    console.log(props.imgCount);
    if (props.imgCount + imageFiles.length > 10) {
      alert("이미지는 최대 10장 까지 업로드 가능합니다.");

      return;
    } else {
      props.setImgCount(props.imgCount + e.target.files.length);
      // image state의 값이 null 인 경우, imageFiles로 대체하고,
      // 그렇지 않은 경우 기존 image 값을 유지하면서 imageFiles를 추가
      props.setImage(
        props.image === null ? imageFiles : [...props.image, ...imageFiles]
      );
      console.log(props.image);
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
        props.setImgFile((prevImages) => [...prevImages, reader.result]);
      };
    }
  };

  return (
    <>
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
      <label htmlFor="file">
        <input
          className="image-upload-input"
          accept="image/*"
          required
          type="file"
          id="file"
          placeholder="이미지를 업로드 해주세요."
          multiple
          onChange={imageFilesHandler}
        />
        <div className="image-upload-btn">이미지 업로드하기</div>
      </label>
    </>
  );
}
