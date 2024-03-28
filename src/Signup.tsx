import React, { useState } from "react";
import "./css/Signup.css";
import axios from "axios";
import {
  FacebookLoginButton,
  GithubLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";
import { Link } from "react-router-dom";
import SocialKaKao from "./func/SocialLogin";
import { getCookie } from "./func/GetApi";

function Signup() {
  const [userId, SetUserId] = useState("");
  const [userPw, setUserPw] = useState("");

  const getLogin = async () => {
    const result: any = await axios.post("http://localhost:8000/login", {
      userId,
      userPw,
    });
    if (result === "fail") {
      alert("아이디와 비밀번호를 확인해주세요");
      SetUserId("");
      setUserPw("");
    } else {
      alert("로그인에 성공하셨습니다.!");
      getCookie(result);
    }
  };
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
            <input
              type="text"
              className={userId}
              placeholder="아이디"
              onChange={(e) => {
                SetUserId(e.target.value);
              }}
            />
            <input
              type="text"
              className={userPw}
              placeholder="비밀번호"
              onChange={(e) => {
                setUserPw(e.target.value);
              }}
            />
            <button
              type="button"
              style={{ color: "white", backgroundColor: "#D32F2F" }}
              className="btn loginBtn"
              onClick={getLogin}
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
          <GithubLoginButton />
          <SocialKaKao />
        </div>
      </div>
    </div>
  );
}

export default Signup;
