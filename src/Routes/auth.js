import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from "../firebase";

function Auth() {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((result) => {
      console.log(result.user);
    })
    .catch((err) => {
      alert(err);
    });
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      <input placeholder="이름을 입력해주세요." onChange={usernameInput} />
      <input placeholder="이메일을 입력해주세요." onChange={emailInput} />
      <input placeholder="비밀번호를 입력해주세요." onChange={passwordInput} />
    </>
  );
}

export default Auth;
