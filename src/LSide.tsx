import React, { useEffect, useState } from "react";
import "./css/LsideStyle.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AccordionFlush from "./Accordion";
import { BsFillBarChartLineFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { deleteCookie } from "./func/GetApi";
import axios from "axios";
import { getCookie } from "./func/GetApi";

export default function Lside() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const cookieString = document.cookie;
  const userName = sessionStorage.getItem("userName");
  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter") {
      getLogin();
    }
  };
  //로그인 하는 함수
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
  const logout = () => {
    deleteCookie();
    sessionStorage.removeItem("userName");
    window.location.replace("/");
  };

  return (
    <div className="mainSide">
      <div className="title">
        <span className="commentLogo">
          <BsFillBarChartLineFill className="myLogo" />
          <span className="additionalText">YTComment </span>
        </span>
      </div>
      {cookieString ? (
        <div>
          <div className="welcome">
            <span style={{ color: "black", fontWeight: "700" }}>
              {userName}
            </span>{" "}
            님 환영합니다.~
          </div>
          <button className="btnLogin" onClick={logout}>
            로그아웃
          </button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={userId}
            className="idInput"
            placeholder="아이디"
            onChange={(e) => setUserId(e.target.value)}
          ></input>
          <input
            type="password"
            value={userPw}
            className="idInput"
            placeholder="비밀번호"
            onChange={(e) => setUserPw(e.target.value)}
            onKeyDown={handleKeyPress}
          ></input>
          <button className="btnLogin" onClick={getLogin}>
            로그인
          </button>
          <br />
          <div className="autoSign" style={{ textAlign: "center" }}>
            {/* <input type="checkbox" className="loginCheckbox" />
            <span className="autoLogin">자동로그인</span> */}
            <span className="signup">
              <span>
                <Link
                  to={"/signup"}
                  style={{ color: "white", textDecoration: "none" }}
                >
                  회원가입
                </Link>
              </span>{" "}
              / SNS가입
            </span>
          </div>
        </div>
      )}
      <AccordionFlush />
    </div>
  );
}
