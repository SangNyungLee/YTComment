import React, { useState } from "react";
import axios from "axios";
import "./css/SignupForm.css";
function SignupForm() {
  const [userEmail, setUserEmail] = useState("");
  const [userEmailCheck, setUserEmailCheck] = useState(false);
  const [userPw, setUserPw] = useState("");
  const [userPwCheck, setUserPwCheck] = useState("");
  const [userName, setUserName] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);

  const PasswordCheck = (e: any) => {
    const { value } = e.target;
    setUserPwCheck(value);
    setIsPasswordMatch(value === userPw);
  };

  const checkUserEmail = async () => {
    try {
      const response = await axios
        .post("http://localhost:8000/checkUserEmail", { userEmail: userEmail })
        .then((res: any) => {
          if (res.data == "success") {
            // 가입가능한 이메일이면
            alert("가입가능한 이메일입니다.");
            setUserEmailCheck(true);
          } else {
            alert("중복된 이메일 입니다.");
            setUserEmailCheck(false);
            setUserEmail(""); // 중복된 이메일이면 input창 비워주기
          }
        });
    } catch (error) {
      console.error("에러", error);
    }
  };
  const handleSignup = async () => {
    if (isPasswordMatch) {
      try {
        const response: any = await axios.post(
          "http://localhost:8000/userSignup",
          {
            userEmail,
            userPw,
            userName,
          }
        );
        if (response.data == "success") {
          alert("회원가입이 완료되었습니다.!!");
          window.location.href = "/";
        } else {
          alert("회원가입 오류!!");
        }
      } catch (error) {
        console.error("signup error", error);
      }
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
          <h1 style={{ color: "#4d627b", fontSize: "2em" }}>회원가입</h1>
        </div>
        <div className="loginForm" style={{ marginBottom: "3rem" }}>
          <form className="formTag">
            <div style={{ marginBottom: userEmailCheck ? "0px" : "10px" }}>
              <input
                type="text"
                className="userEmail"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="이메일주소"
              />
              <button
                type="button"
                className="btn"
                style={{
                  color: "white",
                  backgroundColor: "#d53535",
                  marginLeft: "0.5rem",
                }}
                onClick={checkUserEmail}
              >
                중복확인
              </button>
            </div>
            {userEmailCheck ? (
              <span className="userEmailTag">가입가능한 이메일입니다.</span>
            ) : null}
            <input
              type="password"
              className="userPw"
              value={userPw}
              onChange={(e) => setUserPw(e.target.value)}
              placeholder="비밀번호"
            />
            <input
              type="password"
              className="userPwCheck"
              value={userPwCheck}
              onChange={PasswordCheck}
              placeholder="비밀번호확인"
              style={{ marginBottom: isPasswordMatch ? "0px" : "10px" }}
            />
            {isPasswordMatch ? (
              <span className="pwMatch">비밀번호가 일치합니다.</span>
            ) : null}
            <input
              type="text"
              className="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="닉네임"
            />
            <button
              type="button"
              style={{ color: "white", backgroundColor: "#6bcf70" }}
              className="btn signupBtn"
              // 비밀번호와 이메일이 중복이 아니고 닉네임까지 입력했을 때 활성화
              disabled={!isPasswordMatch || !userEmailCheck || !userName}
              onClick={handleSignup}
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
