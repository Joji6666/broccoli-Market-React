import React from "react";
import { useNavigate } from "react-router-dom";
import broccoliImg from "../broccoli.png";

export default function Intro() {
  const nav = useNavigate();
  return (
    <>
      <div className="intro-box">
        <h1 id="head-text">건강한 중고거래 브로콜리마켓</h1>

        <img src={broccoliImg} id="broccoli-img" />

        <button
          type="button"
          id="start-btn"
          onClick={() => {
            nav("auth");
          }}
        >
          간편 가입하고 시작하기
        </button>
      </div>
    </>
  );
}
