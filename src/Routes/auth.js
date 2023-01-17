import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { app, db } from "../firebase";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const auth = getAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //회원가입 코드
  const createUser = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const userData = {
          username,
          email,
        };

        //         저장할 컬렉션 이름  생성할 문서 이름    문서에 담을 내용
        setDoc(doc(db, "user", result.user.uid), userData).then(async () => {
          updateProfile(result.user, { displayName: username });
          console.log(result.user);
          alert("회원가입이 완료됐습니다.");
          await nav("/login");
        });
      })
      .catch(() => {
        if (password.length < 6) {
          passwrodError();
        } else if (email === "") {
          emailError();
        }
      });
  };

  const passwrodError = () => toast.error("비밀먼호를 6자 이상 입력해주세요.");
  const emailError = () => toast.error("이메일을 확인해주세요.");

  const usernameInput = (e) => {
    setUsername(e.target.value);
  };
  const emailInput = (e) => {
    setEmail(e.target.value);
  };
  const passwordInput = (e) => {
    setPassword(e.target.value);
  };

  return (
    <>
      <input
        type="text"
        placeholder="이름을 입력해주세요."
        onChange={usernameInput}
      />
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

      <button onClick={createUser}>회원가입</button>
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
