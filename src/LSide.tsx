import React, { useEffect, useState } from "react";
import "./css/LsideStyle.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AccordionFlush from "./Accordion";
import { GoCommentDiscussion } from "react-icons/go";
import { BsFillBarChartLineFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { deleteCookie } from "./func/GetApi";
import { useSelector } from "react-redux";
export default function Lside() {
  const [isExpanded, setIsExpanded] = useState(false);
  const cookieString = document.cookie;
  const userName = sessionStorage.getItem("userName");
  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
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
          <div>{userName} 님 환영합니다.~</div>
          <button onClick={logout}>로그아웃하기</button>
        </div>
      ) : (
        <div>
          <input type="text" className="idInput" placeholder="아이디"></input>
          <input type="text" className="idInput" placeholder="비밀번호"></input>
          <button className="btnLogin">로그인</button>
          <br />
          <div className="autoSign">
            <input type="checkbox" className="loginCheckbox" />
            <span className="autoLogin">자동로그인</span>
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
