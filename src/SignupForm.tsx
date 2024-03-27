import React from "react";
import axios from "axios";

function SignupForm() {
  return (
    <div className="mom">
      <div className="login">
        <div
          style={{
            textAlign: "center",
            paddingTop: "30px",
            paddingBottom: "30px",
          }}
        >
          <h1 style={{ color: "#4d627b", fontSize: "2em" }}>회원가입</h1>
        </div>
        <div className="loginForm" style={{ marginBottom: "3rem" }}>
          <form className="formTag">
            <input type="text" placeholder="이메일주소" />
            <input type="text" placeholder="비밀번호" />
            <input type="text" placeholder="비밀번호확인" />
            <input type="text" placeholder="닉네임" />
            <button
              style={{ color: "white", backgroundColor: "#6bcf70" }}
              className="btn signupBtn"
            >
              회원가입
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
