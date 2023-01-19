import React from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";

export default function Main() {
  const nav = useNavigate();

  return (
    <div>
      main
      <button
        onClick={() => {
          nav("/market");
        }}
      >
        장터가기
      </button>
    </div>
  );
}
