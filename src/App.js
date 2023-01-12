import logo from "./logo.svg";
import "./App.css";
import app from "./firebase";
import { Routes, Route } from "react-router-dom";
import Auth from "./Routes/auth";
import Intro from "./Routes/intro";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </div>
  );
}

export default App;
