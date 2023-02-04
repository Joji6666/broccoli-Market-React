import React from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../style.css";
import "./auth.css";
import logo from "../images/broccoli.png";
import { useSelector, useDispatch } from "react-redux";
import { setDisplayName, setEmail, setPassword } from "../store";
import { handelKeyPress } from "../utils/utils";

export default function Auth() {
  const { displayName, email, password } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const nav = useNavigate();

  //회원가입 코드
  const createUser = async () => {
    if (displayName === "") {
      nameError();
    } else {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const userData = {
            username: displayName,
            email,
          };

          //         저장할 컬렉션 이름  생성할 문서 이름    문서에 담을 내용
          setDoc(doc(db, "user", result.user.uid), userData).then(async () => {
            updateProfile(result.user, { displayName: displayName });
            console.log(result.user);
            alert("회원가입이 완료됐습니다.");
            await nav("/login");
          });
        })
        .catch((err) => {
          if (password.length < 6) {
            passwrodError();
          } else if (email === "") {
            emailError();
          } else {
            alert(err);
          }
        });
    }
  };

  const passwrodError = () => toast.error("비밀먼호를 6자 이상 입력해주세요.");
  const emailError = () => toast.error("이메일을 확인해주세요.");
  const nameError = () => toast.error("이름을 확인해주세요.");

  const handleInput = (e, setState) => {
    dispatch(setState(e.target.value));
  };

  return (
    <>
      <main>
        <div className="input-container">
          <div className="input-warp">
            <h1>회원가입</h1>
            <img
              onClick={() => {
                nav("/");
              }}
              src={logo}
            />
            <input
              type="text"
              required
              placeholder="이름을 입력해주세요."
              onChange={(e) => handleInput(e, setDisplayName)}
              onKeyPress={(e) => handelKeyPress(e, createUser)}
            />
            <input
              type="email"
              required
              placeholder="이메일을 입력해주세요."
              onChange={(e) => handleInput(e, setEmail)}
              onKeyPress={(e) => handelKeyPress(e, createUser)}
            />
            <input
              type="password"
              required
              placeholder="비밀번호를 입력해주세요."
              onChange={(e) => handleInput(e, setPassword)}
              onKeyPress={(e) => handelKeyPress(e, createUser)}
            />

            <button className="auth-btn" onClick={createUser}>
              회원가입
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
                nav("/login");
              }}
              id="nav-login"
            >
              이미 회원이신가요?
            </span>
          </div>
        </div>
      </main>
    </>
  );
}
