import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";

export default function Chat() {
  const auth = getAuth();
  const [username, setUserName] = useState("");
  const [userUid, setUserUid] = useState("");
  const [chatroom, setChatRoom] = useState([]);
  const [chatRoomid, setChatRoomId] = useState("");
  const [chatData, setCahtData] = useState([]);
  const [chatContent, setChatContent] = useState("");

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

    console.log(chatroom);
    console.log(userUid);
    console.log(chatroom.id);
    console.log(chatRoomid);

    //userUid가 업데이트 후 훅이 실행되게 설정
    // userUid 값을 받은 후 훅이  실행되어야 쿼리를 제대로 할 수 있다
    // userUid가 업데이트 되지 않은 상태로 훅이 실행하면 data.docs는 빈 배열이 된다. user에 userUid와 같은 문서가 없기 때문
  }, [userUid]);

  const chatHandler = (e) => {
    setChatContent(e.target.value);
  };

  //채팅 메세지를 파이어스토어 db에 전송하는 코드
  const sendMessage = () => {
    //chatroon 컬렉션에 현재 설정된 chatRoomid를 참조하는법
    //chatroom 지역을 클릭하면 setChatRoomid를 이용하여 chatRoomid가 설정된다.
    const docRef = doc(db, "chatroom", chatRoomid);
    let messageRef;

    getDoc(docRef).then((snapshot) => {
      //exists = 문서가 존재하는지 확인

      //Firestore에서 필드는 문서로 치지 않는다.
      //문서는 데이터를 가지고 있는 것이고 필드는 문서에 포함된 데이터를 구성하는 것이다.
      //예를 들어, 가져온 문서에서 name, age, address라는 필드가 있다면, 그것들은 그 문서에 포함된 데이터를 구성하는 것이다.
      // 그리하여 docRef를 가져온 후 exists를 이용하여 문서가 존재하는지 확인하면 하위컬렉션이 있다면 그 안에 새로운 문서를 저장할 것이고
      // 하위컬렉션이 존재하지 않는다면 messages라는 컬렉션을 생성함과 동시에 문서를 추가하도록 했다.

      //messages 컬렉션이 존재하지않으면 messages 컬렉션을 만듬과 동시에 문서를 추가한다.
      if (!snapshot.exists) {
        //문서에 데이터를 처음 추가할 때 암묵적으로 컬렉션과 문서를 생성한다.
        //이를 이용하여 chatroom에 하위 컬렉션으로 messages를 만들고 문서를 생성할 수 있다.
        messageRef = addDoc(collection(docRef, "messages"), {
          content: chatContent,
          author: username,
          date: new Date().toString(),
          authorUid: userUid,
        });
      }
      // 이미 messages 컬렉션이 있다면 setDoc을 이용하여 문서만 추가한다.
      else {
        messageRef = doc(collection(docRef, "messages"));
        setDoc(messageRef, {
          content: chatContent,
          author: username,
          date: new Date().toString(),
          authorUid: userUid,
        });
      }
    });
  };

  //  chatroomId에 하위 컬렉션인 messages에서 데이터를 가져오고 date순으로 정렬 그 후  onSnapshot으로  실시간 데이터 반영
  const collectionRef = async () => {
    //chatroon 컬렉션에 현재 설정된 chatRoomid를 참조하는법
    await doc(db, "chatroom", chatRoomid);
    await query(collectionGroup(db, "messages"), where("user", "==", userUid));
  };

  useEffect(() => {
    const queryMessages = query(
      collectionGroup(db, "messages"),
      where("user", "==", userUid)
    );
    const getMessages = getDocs(queryMessages).then((data) => {
      console.log(data.docs);
    });

    console.log(queryMessages);
    console.log(chatRoomid);
  }, [chatRoomid]);

  return (
    <>
      <h1>채팅방</h1>

      <div className="chat-container">
        <div className="chat-list"></div>
        {/* 위에서 가져온 내 uid가 포함된 문서들을 반복문을 통해 화면에 보여준다. */}
        {chatroom.map((data) => {
          return (
            <>
              <div
                onClick={() => {
                  setChatRoomId(data.id);
                  console.log(chatRoomid);
                }}
                className="chatroom"
              >
                <div>{data.data().productTitle}</div>
                <div>{data.data().username}</div>
                <div> {data.data().productId}</div>
              </div>
            </>
          );
        })}
        <div className="content-container"></div>
        <input className="chat-content" onChange={chatHandler}></input>
        <button onClick={sendMessage}>전송</button>
      </div>
    </>
  );
}
