import React from "react";
import { useNavigate } from "react-router-dom";
import broccoliImg from "../../public/broccoli.png";

export default function Intro() {
  const nav = useNavigate();
  return (
    <>
      <div class="intro-box">
        <h1 id="head-text">건강한 중고거래 브로콜리마켓</h1>

        <img
          src={broccoliImg}
          id="broccoli-img"
          style="height: 400px; width: 400px"
        />

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
