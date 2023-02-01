import { getAuth, onAuthStateChanged } from "firebase/auth";
import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { setUserName, setUserUid } from "./store";

export default function Test() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  //useSelector는 Redux store의 state에서 값을 조회하는 기능을 한다.
  //React 컴포넌트에서 store의 state 값에 접근할 수 있도록 도와주며,
  // state의 변경이 있을 때마다 컴포넌트가 자동으로 업데이트된다.
  // store.js에서 설정한 auth state를 가져왔다.
  const { username, userUid } = useSelector((state) => state.auth);
  //dispatch() 함수는 Redux store에서 액션을 보내는 역할한다.

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        //dispatch 를 이용하여 firebase auth에서 가져온 userdata를 보낸다.
        dispatch(setUserName(user.displayName));
        dispatch(setUserUid(user.uid));
        console.log(user);
      } else {
        alert("로그인을 해주세요.");
        nav("/login");
      }
    });
  }, []);

  useEffect(() => {
    //로그인 상태 관리 코드
    console.log(userUid);
  }, [userUid]);

  return (
    <>
      <h1>환영한다</h1>
      <div>User:{username}</div>
    </>
  );
}

