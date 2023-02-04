import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import useDidMountEffect from "../usedidmounteffect";
import "../style.css";
import "../Routes/chat.css";
import { handelKeyPress } from "../utils/utils";

export default function Chating(props) {
  const [chatData, setCahtData] = useState([]);
  const [chatContent, setChatContent] = useState("");

  const chatRef = useRef();
  const inputRef = useRef(null);
  const chatHandler = (e) => {
    setChatContent(e.target.value);
  };

  useDidMountEffect(async () => {
    //messages 컬렉션까지 접근
    const chatRoomRef = collection(db, "chatroom");
    const chatRoomDoc = doc(chatRoomRef, props.chatRoomid);
    const messagesRef = collection(chatRoomDoc, "messages");

    //시간으로 정렬
    const q = query(messagesRef, orderBy("date", "asc"));

    // 실시간으로 messages 컬렉션에 있는 문서들을 가져온다.
    onSnapshot(q, async (data) => {
      // 그 후 그 배열들을 state에 넣는다.
      setCahtData(data.docs.map((doc) => doc.data()));
    });
  }, [props.chatRoomid]);
  //채팅 메세지를 파이어스토어 db에 전송하는 코드
  const sendMessage = async () => {
    //chatroon 컬렉션에 현재 설정된 chatRoomid를 참조하는법
    //chatroom 지역을 클릭하면 setChatRoomid를 이용하여 chatRoomid가 설정된다.
    const docRef = await doc(db, "chatroom", props.chatRoomid);

    await getDoc(docRef).then(async (snapshot) => {
      //Firestore에서 필드는 문서로 치지 않는다.
      //문서는 데이터를 가지고 있는 것이고 필드는 문서에 포함된 데이터를 구성하는 것이다.
      //예를 들어, 가져온 문서에서 name, age, address라는 필드가 있다면, 그것들은 그 문서에 포함된 데이터를 구성하는 것이다.

      //messages 컬렉션이 존재하지않으면 messages 컬렉션을 만듬과 동시에 문서를 추가한다.

      //문서에 데이터를 처음 추가할 때 암묵적으로 컬렉션과 문서를 생성한다.
      //이를 이용하여 chatroom에 하위 컬렉션으로 messages를 만들고 문서를 생성할 수 있다.

      const messageRef = await addDoc(collection(docRef, "messages"), {
        content: chatContent,
        author: props.username,
        date: Number(new Date()),
        authorUid: props.userUid,
      });
    });
    inputRef.current.value = "";
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
    <>
      <div style={{ display: props.display }} className="content-container">
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
                <div className="chat-content-warp">
                  <div
                    className="chat-box"
                    style={
                      props.userUid == data.authorUid
                        ? { float: "right" }
                        : { float: "left" }
                    }
                    id={data.authorUid}
                  >
                    <div
                      style={
                        props.userUid == data.authorUid
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
                      {props.userUid == data.authorUid ? (
                        <div style={{ fontSize: "12px", marginRight: "2px" }}>
                          {date.getHours()}:{date.getMinutes()}
                        </div>
                      ) : null}

                      <div
                        style={
                          props.userUid == data.authorUid
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
                      {props.userUid != data.authorUid ? (
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
              onKeyPress={(e) => handelKeyPress(e, sendMessage)}
            ></input>
            <button className="send-btn" onClick={sendMessage}>
              전송
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
