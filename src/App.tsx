import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./css/App.css";
import NavBar from "./NavBar";
import Lside from "./LSide";
import Sidebar from "./SideBar";
import { Nav } from "react-bootstrap";
import "@fontsource/open-sans"; // Defaults to weight 400
import "@fontsource/open-sans"; // Defaults to weight 400
import "@fontsource/open-sans/400.css"; // Specify weight
import "@fontsource/open-sans/400-italic.css"; // Specify weight and style
import Main from "./Main";
import Search from "./Search";
import Page from "./Page";
import Signup from "./Signup";
import SignupForm from "./SignupForm";
import SearchPage from "./SearchPage";
function App() {
  // 초기 상태를 window.innerWidth로 설정
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      // 리사이즈 이벤트 발생 시 window.innerWidth 값을 업데이트
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="myContainer">
      <BrowserRouter>
        <div>
          {windowWidth > 991 && <Lside />}
          {windowWidth <= 991 && <Sidebar />}
        </div>
        <div>
          <NavBar />
          <Routes>
            <Route path="/nav" element={<NavBar />} />
            <Route path="/" element={<Main />} />
            <Route path="/search" element={<Search />} />
            <Route path="/page" element={<Page />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signupForm" element={<SignupForm />} />
            <Route path="/searchPage" element={<SearchPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
