import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export const useAuth = (setName, setUid) => {
  const dispatch = useDispatch();
  const nav = useNavigate();

  useEffect(() => {
    //로그인 상태 관리 코드
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setName(user.displayName));
        dispatch(setUid(user.uid));
        console.log(user);
      } else {
        alert("로그인을 해주세요.");
        nav("/login");
      }
    });
  }, []);
};

export const handelKeyPress = (e, callback) => {
  if (e.key === "Enter") {
    e.preventDefault();
    callback();
  }
};
