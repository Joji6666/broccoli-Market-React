import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import "../style.css";
import "./chat.css";
import { useSelector } from "react-redux";
import Chating from "../componets/chating";
import { useAuth } from "../utils/utils";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const [chatroom, setChatRoom] = useState([]);
  const [chatRoomid, setChatRoomId] = useState("");
  const [display, setDisplay] = useState("none");

  const { username, userUid } = useSelector((state) => state.auth);
  const nav = useNavigate();

  if (userUid == "") {
    alert("로그인을 해주세요.");
    nav("/login");
  }

  useAuth();

  useEffect(() => {
    //chatroom 컬렉션에서 userUid가 포함돼있는 문서들을 가져온다.
    const queryChatRoom = query(
      collection(db, "chatroom"),
      where("user", "array-contains", userUid)
    );
    const getChatRoom = getDocs(queryChatRoom);
    getChatRoom.then((data) => {
      // 가져온 문서 배열들을 chatroom에 저장
      setChatRoom(data.docs);
      console.log(data.docs);
    });

    //userUid가 업데이트 후 훅이 실행되게 설정
    // userUid 값을 받은 후 훅이  실행되어야 쿼리를 제대로 할 수 있다
    // userUid가 업데이트 되지 않은 상태로 훅이 실행하면 data.docs는 빈 배열이 된다. user에 userUid와 같은 문서가 없기 때문
  }, [userUid]);

  const listRef = useRef();

  return (
    <main>
      <div className="chat-container">
        <div ref={listRef} className="chat-list">
          <h1>채팅 목록</h1>
          {/* 위에서 가져온 내 uid가 포함된 문서들을 반복문을 통해 화면에 보여준다. */}
          {chatroom.map((data) => {
            return (
              <div>
                <div className="chatroom-container">
                  <div
                    onClick={() => {
                      setChatRoomId(data.id);
                      console.log(chatRoomid);
                      listRef.current.style.display = "none";
                      setDisplay("");
                    }}
                    className="chatroom"
                  >
                    <div>
                      <img className="titleImage" src={data.data().imageUrl} />
                    </div>
                    <div className="chatInfo">
                      <div>상품이름:{data.data().productTitle}</div>
                      <div>
                        채팅 참가자:{data.data().username[0]},
                        {data.data().username[1]}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ margin: "5px", marginLeft: "15px" }}>
          <button
            style={{
              display: display,
              border: "none",
              backgroundColor: "green",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => {
              setDisplay("none");
              listRef.current.style.display = "";
            }}
          >
            <svg
              style={{ width: "2rem", height: "2rem" }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
            </svg>
          </button>
        </div>
        <Chating
          username={username}
          userUid={userUid}
          chatRoomid={chatRoomid}
          display={display}
        />
      </div>
    </main>
  );
}
