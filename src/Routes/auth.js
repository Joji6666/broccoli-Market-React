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
import { addDoc, collection, getDoc, doc, setDoc } from "firebase/firestore";

function Auth() {
  const auth = getAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const createUser = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const userData = {
          username,
          email,
        };

        setDoc(doc(db, "user", result.user.uid), userData);

        // db.collection("user")
        // .doc(result.user.uid)
        // .set(userInfo)
        // .then(() => {
        //   result.user.updateProfile({ displayName: name });

        console.log(result.user);
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

export default Auth;
