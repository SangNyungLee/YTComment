import React from "react";
import KakaoLogin from "react-kakao-login";
import axios from "axios";
import { getCookie } from "./GetApi";
import "../css/KakaoButton.css";
const SocialKaKao = () => {
  // const kakaoClientId = process.env.JAVASCRIPT_KEY!;
  const kakaoClientId = "9637f98e72d543af39527ee6b7855c7c";
  const kakaoOnSuccess = async (data: any) => {
    console.log(data);
    const idToken = data.response.access_token; // 엑세스 토큰 백엔드로 전달
    const result = await axios.post("http://localhost:8000/auth/kakao", {
      Token: idToken,
    });
    getCookie("key", result);
    // const token = result.data;
    // // 만료날짜 설정
    // const expires = new Date();
    // expires.setTime(expires.getTime() + 2 * 60 * 60 * 1000);
    // // 쿠키 설정 (path 설정 = 쿠키가 적용되는 경로지정)
    // document.cookie = `token = ${token}; expires=${expires.toUTCString()} path=/`;
    // window.location.href = "/";
  };
  const kakaoOnFailure = (error: any) => {
    console.log(error);
  };

  return (
    <>
      <KakaoLogin
        className="kakao-login-button"
        style={{ lineHeight: "40px" }}
        token={kakaoClientId}
        onSuccess={kakaoOnSuccess}
        onFail={kakaoOnFailure}
      />
    </>
  );
};

export default SocialKaKao;
