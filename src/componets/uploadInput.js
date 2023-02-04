import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setContent, setPrice, setTagValue, setTitle } from "../store";
import "../style.css";
import "../Routes/upload.css";
import { useRef } from "react";

export default function UploadInput({
  titleDefaultValue,
  priceDefaultValue,
  contentDefaultValue,
  tag,
  setTag,
}) {
  const dispatch = useDispatch();

  const { tagValue } = useSelector((state) => state.uploadData);
  const tagRef = useRef(null);
  const handleInput = (e, setState) => {
    dispatch(setState(e.target.value));
  };

  const handleClick = () => {
    // tag 배열의 길이가 5보다 작은 경우만 추가
    if (tag.length < 5) {
      setTag((tags) => [...tags, tagValue]);
    } else {
      alert("연관검색어는 최대 5개까지 추가 가능합니다.");
    }
    tagRef.current.value = "";
    dispatch(setTagValue(""));
  };

  return (
    <>
      <input
        defaultValue={titleDefaultValue}
        required
        type="text"
        id="title"
        placeholder="상품 제목을 입력해주세요."
        onChange={(e) => handleInput(e, setTitle)}
      />
      <div className="tag-box">
        <input
          ref={tagRef}
          required
          type="text"
          id="tag"
          maxLength="10"
          placeholder="상품과 연관된 태그를 입력해주세요. 최대 5개"
          onChange={(e) => handleInput(e, setTagValue)}
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
        defaultValue={priceDefaultValue}
        required
        type="text"
        id="price"
        placeholder="상품 가격을 입력해주세요."
        onChange={(e) => handleInput(e, setPrice)}
      />
      <input
        defaultValue={contentDefaultValue}
        required
        type="text"
        id="content"
        placeholder="상품 내용을 입력해주세요."
        onChange={(e) => handleInput(e, setContent)}
      />
    </>
  );
}
