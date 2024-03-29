import React from "react";
import { KeyboardEvent, useState } from "react";
import { Navbar, Nav, NavDropdown, NavLink } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
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

  const handleKeyDown = async (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      SetYoutubeSearch("");
      searchYoutubeVideos(youtubeSearch, " ");
    }
  };
  const NEW = () => {
    dispatch(changeCategory.recent());
  };
  const MUSIC = () => {
    dispatch(changeCategory.music());
  };
  const GAME = () => {
    dispatch(changeCategory.game());
  };
  const MOVIE = () => {
    dispatch(changeCategory.movie());
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
            <Nav.Link onClick={MOVIE} className="navborder">
              영화
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
