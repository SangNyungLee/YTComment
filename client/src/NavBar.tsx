import React from "react";
import { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./css/NavBar.css";
import { changeCategory } from "./store";
import { searchYoutubeVideos } from "./func/GetApi";
import {
  BsFillHouseDoorFill,
  BsFillPersonFill,
  BsSearch,
} from "react-icons/bs";

function NavBar() {
  const [youtubeSearch, SetYoutubeSearch] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleKeyDown = async (e: any) => {
    if (e.key === "Enter") {
      searchYoutubeVideos(youtubeSearch, " ");
      navigate("/search", { state: { data: youtubeSearch } });
      SetYoutubeSearch("");
    }
  };
  const NEW = () => {
    dispatch(changeCategory.recent());
    navigate("/");
  };
  const MUSIC = () => {
    dispatch(changeCategory.music());
    navigate("/");
  };
  const GAME = () => {
    dispatch(changeCategory.game());
    navigate("/");
  };
  const ANIMAL = () => {
    dispatch(changeCategory.animal());
    navigate("/");
  };

  return (
    <div>
      <Navbar bg="light" expand="lg" className="mainNavBar">
        <Navbar.Brand href="/">
          <BsFillHouseDoorFill className="goHome" />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="order-0"
        ></Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto navFlex">
            <Nav.Link onClick={NEW} className="navborder">
              최신
            </Nav.Link>
            <Nav.Link onClick={MUSIC} className="navborder">
              음악
            </Nav.Link>
            <Nav.Link onClick={GAME} className="navborder">
              게임
            </Nav.Link>
            <Nav.Link onClick={ANIMAL} className="navborder">
              동물
            </Nav.Link>
          </Nav>
          <Nav className="mr-auto">
            <Nav.Link>
              <input
                type="text"
                placeholder={`검색어입력`}
                value={youtubeSearch}
                onChange={(e) => SetYoutubeSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <span>
                <Link to={"/search"} state={{ data: youtubeSearch }}>
                  <BsSearch className="searchIcons" />
                </Link>
              </span>
            </Nav.Link>
            <Nav.Link>
              <BsFillPersonFill style={{ fontSize: "30px" }} />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="navUnderline"></div>
    </div>
  );
}

export default NavBar;
