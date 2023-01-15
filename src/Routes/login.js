import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";

export default function Login() {
  const auth = getAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //로그인 코드
  const userLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        alert("로그인 됐습니다.");
        nav("/main");
      })
      .catch((err) => {
        if (password.length < 6) {
          passwrodError();
        } else if (email === "") {
          emailError();
        }
        toast.error("이메일과 패스워드를 확인해주세요.");
      });
  };

  const passwrodError = () => toast.error("비밀먼호를 6자 이상 입력해주세요.");
  const emailError = () => toast.error("이메일을 확인해주세요.");

  const emailInput = (e) => {
    setEmail(e.target.value);
  };
  const passwordInput = (e) => {
    setPassword(e.target.value);
  };

  return (
    <>
      <input
        type="email"
        placeholder="이메일을 입력해주세요."
        onChange={emailInput}
      />
      <input
        type="password"
        placeholder="비밀번호를 입력해주세요."
        onChange={passwordInput}
      />

      <button onClick={userLogin}>로그인</button>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}