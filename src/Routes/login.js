import React from "react";
import { signInWithEmailAndPassword } from "firebase/auth";

import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";
import "./auth.css";
import "../style.css";
import logo from "../images/broccoli.png";
import { auth } from "../firebase";
import { useSelector, useDispatch } from "react-redux";
import { setEmail, setPassword } from "../store";
import { handelKeyPress } from "../utils/utils";

export default function Login() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { email, password } = useSelector((state) => state.auth);

  //로그인 코드
  const userLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        alert("로그인 됐습니다.");
        nav("/");
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

  const handleInput = (e, setState) => {
    dispatch(setState(e.target.value));
  };

  return (
    <>
      <main>
        <div className="input-container">
          <div className="input-warp">
            <h1>로그인</h1>
            <img
              onClick={() => {
                nav("/");
              }}
              src={logo}
            />
            <input
              type="email"
              required
              placeholder="이메일을 입력해주세요."
              onChange={(e) => handleInput(e, setEmail)}
              onKeyPress={(e) => handelKeyPress(e, userLogin)}
            />
            <input
              required
              type="password"
              placeholder="비밀번호를 입력해주세요."
              onChange={(e) => handleInput(e, setPassword)}
              onKeyPress={(e) => handelKeyPress(e, userLogin)}
            />

            <button className="auth-btn" onClick={userLogin}>
              로그인
            </button>
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
            <span
              onClick={() => {
                nav("/auth");
              }}
              id="nav-login"
            >
              회원이 아니신가요?
            </span>
          </div>
        </div>
      </main>
    </>
  );
}
