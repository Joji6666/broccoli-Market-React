import logo from "./logo.svg";
import "./App.css";
import app from "./firebase";
import { Routes, Route } from "react-router-dom";
import Auth from "./Routes/auth";
import Intro from "./Routes/intro";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;
