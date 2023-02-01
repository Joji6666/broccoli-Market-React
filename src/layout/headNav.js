import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/broccoli.png";
import "./headNav.css";

export default function HeadNav() {
  const nav = useNavigate();
  return (
    <>
      <div className="headNavbar">
        <img
          onClick={() => {
            nav("/");
          }}
          className="logo"
          src={logo}
        />
        <span
          style={{
            cursor: "pointer",
            fontWeight: "bold",
            color: "green",
            marginLeft: "10px",
          }}
          onClick={() => {
            nav("/");
          }}
        >
          브로콜리마켓
        </span>
      </div>
    </>
  );
}
