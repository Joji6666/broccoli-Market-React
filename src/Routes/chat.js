import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";

export default function Chat() {
  const auth = getAuth();
  const [username, setUserName] = useState("");
  const [userUid, setUserUid] = useState("");
  const [chatroom, setChatroom] = useState(null);

  useEffect(() => {
    //로그인 상태 관리 코드
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName);
        setUserUid(user.uid);
        console.log(user);
      }
    });
  }, []);

  const queryChatRoom = query(
    collection(db, "chatroom"),
    where("user", "array-contains", userUid)
  );
  const getChatRoom = getDocs(queryChatRoom);
  getChatRoom.then((data) => {
    console.log(data.docs);
  });

  console.log(chatroom);
  console.log(userUid);

  return (
    <>
      <h1>채팅방</h1>

      <div className="chat-container">
        <div className="chat-list"></div>

        <div className="chat-content"></div>
      </div>
    </>
  );
}
