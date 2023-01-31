import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import useDidMountEffect from "../usedidmounteffect";
import "../style.css";
import "./chat.css";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const auth = getAuth();
  const [username, setUserName] = useState("");
  const [userUid, setUserUid] = useState("");
  const [chatroom, setChatRoom] = useState([]);
  const [chatRoomid, setChatRoomId] = useState("");
  const [chatData, setCahtData] = useState([]);
  const [chatContent, setChatContent] = useState("");
  const [display, setDisplay] = useState("none");

  const nav = useNavigate();
  useEffect(() => {
    //로그인 상태 관리 코드
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName);
        setUserUid(user.uid);
        console.log(user);
      } else {
        alert("로그인을 해주세요.");
        nav("/login");
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
  const sendMessage = async () => {
    //chatroon 컬렉션에 현재 설정된 chatRoomid를 참조하는법
    //chatroom 지역을 클릭하면 setChatRoomid를 이용하여 chatRoomid가 설정된다.
    const docRef = await doc(db, "chatroom", chatRoomid);

    await getDoc(docRef).then(async (snapshot) => {
      //Firestore에서 필드는 문서로 치지 않는다.
      //문서는 데이터를 가지고 있는 것이고 필드는 문서에 포함된 데이터를 구성하는 것이다.
      //예를 들어, 가져온 문서에서 name, age, address라는 필드가 있다면, 그것들은 그 문서에 포함된 데이터를 구성하는 것이다.

      //messages 컬렉션이 존재하지않으면 messages 컬렉션을 만듬과 동시에 문서를 추가한다.

      //문서에 데이터를 처음 추가할 때 암묵적으로 컬렉션과 문서를 생성한다.
      //이를 이용하여 chatroom에 하위 컬렉션으로 messages를 만들고 문서를 생성할 수 있다.

      const messageRef = await addDoc(collection(docRef, "messages"), {
        content: chatContent,
        author: username,
        date: new Date().toString(),
        authorUid: userUid,
      });
    });
    inputRef.current.value = "";
  };

  //   const chatRoomRef = collection(db, "chatrooms").doc("chatroom1");
  // const query = collection(chatRoomRef, "messages");
  // const snapshot = getDocs(query);

  // snapshot.then((data) => {
  //     console.log(data.docs);
  // });

  useDidMountEffect(async () => {
    //messages 컬렉션까지 접근
    const chatRoomRef = collection(db, "chatroom");
    const chatRoomDoc = doc(chatRoomRef, chatRoomid);
    const messagesRef = collection(chatRoomDoc, "messages");

    //시간으로 정렬
    const q = query(messagesRef, orderBy("date", "asc"));

    // 실시간으로 messages 컬렉션에 있는 문서들을 가져온다.
    onSnapshot(q, async (data) => {
      // 그 후 그 배열들을 state에 넣는다.
      setCahtData(data.docs.map((doc) => doc.data()));
    });

    console.log(chatData);
    console.log(chatRoomid);

    console.log(chatData);
  }, [chatRoomid]);
  const listRef = useRef();
  const chatRef = useRef();
  const inputRef = useRef(null);
  const handelKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
      inputRef.current.value = "";
    }
  };

  //스코롤 하단 고정 코드
  const scrollToBottom = () => {
    if (chatRef) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatData]);

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
                    <div>상품이름:{data.data().productTitle}</div>
                    <div>판매자:{data.data().username}</div>
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
        <div style={{ display: display }} className="content-container">
          <h1>채팅방</h1>
          <div
            ref={chatRef}
            style={{
              overflowY: "scroll",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {chatData.map((data) => {
              const date = new Date(data.date);
              return (
                <>
                  {console.log(data)}
                  <div className="chat-content-warp">
                    <div
                      className="chat-box"
                      style={
                        userUid == data.authorUid
                          ? { float: "right" }
                          : { float: "left" }
                      }
                      id={data.authorUid}
                    >
                      <div
                        style={
                          userUid == data.authorUid
                            ? {
                                float: "right",
                                marginTop: "5px",
                                marginLeft: "5px",
                              }
                            : {
                                float: "left",
                                marginTop: "5px",
                                marginRight: "5px",
                              }
                        }
                      >
                        {data.author}
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {userUid == data.authorUid ? (
                          <div style={{ fontSize: "12px", marginRight: "2px" }}>
                            {date.getHours()}:{date.getMinutes()}
                          </div>
                        ) : null}

                        <div
                          style={
                            userUid == data.authorUid
                              ? {
                                  backgroundColor: "green",
                                  borderRadius: "5px",
                                  padding: "5px",
                                }
                              : {
                                  backgroundColor: "gray",
                                  borderRadius: "5px",
                                  padding: "5px",
                                }
                          }
                        >
                          {data.content}
                        </div>
                        {userUid != data.authorUid ? (
                          <div style={{ fontSize: "12px", marginRight: "2px" }}>
                            {date.getHours()}:{date.getMinutes()}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
            <div>
              <input
                ref={inputRef}
                className="chat-content"
                onChange={chatHandler}
                onKeyPress={handelKeyPress}
              ></input>
              <button className="send-btn" onClick={sendMessage}>
                전송
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
