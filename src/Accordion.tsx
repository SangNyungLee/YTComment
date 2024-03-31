import React from "react";
import Accordion from "react-bootstrap/Accordion";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/Accordion.css";
import { BsStar, BsSearch, BsChatRight, BsTrophy } from "react-icons/bs";
function AccordionFlush() {
  return (
    <Accordion className="accordion">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <BsStar className="accordionIcon" />
          유튜브 스크랩
        </Accordion.Header>
        <Accordion.Body>
          <li>MY 채널 스크랩</li>
          <li>MY 영상 스크랩</li>
        </Accordion.Body>
      </Accordion.Item>
      {/* 
      <Accordion.Item eventKey="1">
        <Accordion.Header>
          <BsSearch className="accordionIcon" />
          유튜브 영상검색
        </Accordion.Header>
        <Accordion.Body>
          <ul>
            <li>1번</li>
            <li>2번</li>
            <li>3번</li>
          </ul>
        </Accordion.Body>
      </Accordion.Item> */}

      <Accordion.Item eventKey="2">
        <Accordion.Header>
          <BsChatRight className="accordionIcon" />
          커뮤니티
        </Accordion.Header>
        <Accordion.Body>
          <li>공지사항</li>
          <li>자유게시판</li>
          <li>질문게시판</li>
          <li>토론게시판</li>
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="3">
        <Accordion.Header>
          <BsTrophy className="accordionIcon" />
          유튜브 채널랭킹
        </Accordion.Header>
        <Accordion.Body>
          <li>전체 순위</li>
          <li>게임</li>
          <li>인물/연예인</li>
          <li>음악/댄스/가수</li>
          <li>TV/방송</li>
          <li>음식/요리/레시피</li>
          <li>패션/미용</li>
          <li>뉴스/정치/사회</li>
          <li>취미/라이프</li>
          <li>IT/기술/컴퓨터</li>
          <li>회사/오피셜</li>
          <li>교육/강의</li>
          <li>영화/만화/애니</li>
          <li>키즈/어린이</li>
          <li>애완/반려동물</li>
          <li>스포츠/운동</li>
          <li>국내/해외/여행</li>
          <li>자동차</li>
          <li>주식/경제/부동산</li>
          <li>기타</li>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default AccordionFlush;
