import logo from "./logo.svg";
import "./App.css";
import app from "./firebase";
import { Routes, Route } from "react-router-dom";
import Auth from "./Routes/auth";
import Intro from "./Routes/intro";
import Login from "./Routes/login";
import Main from "./Routes/main";
import Market from "./Routes/market";
import Upload from "./Routes/upload";
import Detail from "./Routes/detail";
import Chat from "./Routes/chat";
import Mypage from "./Routes/mypage";
import Edit from "./Routes/edit";
import Navbar from "./layout/navbar";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Navbar />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/main" element={<Main />} />
        <Route path="/market" element={<Market />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/edit" element={<Edit />} />
      </Routes>
    </div>
  );
}

export default App;
