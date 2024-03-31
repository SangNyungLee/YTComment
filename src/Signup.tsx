import React, { useState } from "react";
import "./css/Signup.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  FacebookLoginButton,
  GithubLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";
import { Link } from "react-router-dom";
import SocialKaKao from "./func/SocialLogin";
import { getCookie } from "./func/GetApi";

function Signup() {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const dispatch = useDispatch();
  const getLogin = async () => {
    const result: any = await axios.post("http://localhost:8000/login", {
      userId,
      userPw,
    });
    if (result.data === "fail") {
      alert("아이디와 비밀번호를 확인해주세요");
      setUserId("");
      setUserPw("");
    } else {
      getCookie("token", result.data.token);
      sessionStorage.setItem("userName", result.data.user.username);
      alert("로그인에 성공하셨습니다.!");
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
              value={userId}
              className={userId}
              placeholder="아이디"
              onChange={(e) => {
                setUserId(e.target.value);
              }}
            />
            <input
              type="text"
              value={userPw}
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
          <div className="loginSNS">SNS 계정으로 로그인</div>
          <SocialKaKao />
          {/* <GoogleLoginButton /> */}
          {/* <GithubLoginButton /> */}
        </div>
      </div>
    </div>
  );
}

export default Signup;
