import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../firebase";
import { setUserName, setUserUid } from "../store";

export const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    //로그인 상태 관리 코드
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUserName(user.displayName));
        dispatch(setUserUid(user.uid));
        console.log(user);
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
