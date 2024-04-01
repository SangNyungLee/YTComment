import React from "react";
import KakaoLogin from "react-kakao-login";
import axios from "axios";
import { getCookie } from "./GetApi";
import "../css/KakaoButton.css";
const SocialKaKao = () => {
  const kakaoClientId = process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY!;
  const kakaoOnSuccess = async (data: any) => {
    console.log(data);
    const idToken = data.response.access_token; // 엑세스 토큰 백엔드로 전달
    const result = await axios.post("http://localhost:8000/api/auth/kakao", {
      Token: idToken,
    });
    getCookie("token", result.data.token);
    sessionStorage.setItem("userName", result.data.user.username.nickname);
    alert("로그인에 성공하셨습니다.!");
  };
  const kakaoOnFailure = (error: any) => {
    alert("로그인에 실패하였습니다.");
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
