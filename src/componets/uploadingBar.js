import React from "react";

import "../Routes/upload.css";
export default function UploadingBar(props) {
  return (
    <div
      ref={props.uploadRef}
      className="uploading-box"
      style={{ display: "none" }}
    >
      <div className="animation-box">
        <h1 data-text="uploading">uploading</h1>
      </div>
    </div>
  );
}
