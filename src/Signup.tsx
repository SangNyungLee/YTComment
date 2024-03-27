import React from "react";
import "./css/Signup.css";
import {
  FacebookLoginButton,
  GoogleLoginButton,
  InstagramLoginButton,
} from "react-social-login-buttons";
import { Link } from "react-router-dom";
function Signup() {
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
          <h1 style={{ color: "#4d627b", fontSize: "2em" }}>로그인</h1>
        </div>
        <div className="loginForm">
          <form className="formTag">
            <input type="text" placeholder="아이디" />
            <input type="text" placeholder="비밀번호" />
            <button
              style={{ color: "white", backgroundColor: "#D32F2F" }}
              className="btn loginBtn"
            >
              로그인
            </button>
            <Link
              to={"/signupForm"}
              style={{ color: "white", backgroundColor: "#6bcf70" }}
              className="btn signupBtn"
            >
              <button
                style={{
                  border: "0px",
                  color: "white",
                  backgroundColor: "#6bcf70",
                }}
              >
                회원가입
              </button>
            </Link>
          </form>
        </div>
        <div className="dddd" style={{}}>
          <input type="checkBox" style={{ marginRight: "10px" }} />
          <span>자동로그인</span>
        </div>
        <div className="socialLogin">
          <span className="loginSNS">SNS 계정으로 로그인</span>
          <FacebookLoginButton className="fbButton" />
          <GoogleLoginButton />
          <InstagramLoginButton />
        </div>
      </div>
    </div>
  );
}

export default Signup;
