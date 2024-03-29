import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Col, Row, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/Main.css";
import Spinner from "react-bootstrap/Spinner";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { BsYoutube, BsFillPinFill } from "react-icons/bs";
import { fetchComments, truncateText } from "./func/GetApi";
import { RootState } from "./store";
import "./css/Pagination.css";
import Pagination from "react-js-pagination";
//API키
export default function Main() {
  const apiKey = "AIzaSyBrSPFESYjexkwyDYm99UyIPhBXWtcxK4U";
  const [videos, setVideos] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [pageToken, setPageToken] = useState("");
  const [commentData, setCommentData] = useState<any>({});
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [categoryNumber, setCategoryNumber] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  // const [searchParams] = useSearchParams();
  // const page = searchParams.get("page");

  const newCategory = useSelector(
    (state: RootState) => state.category.category
  );

  const handlePageChange = (page: number) => {
    setPage(page);
  };
  const fetchVideos = async (token: string) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/trending");
      const newVideos = res.data;
      setVideos([...newVideos]);
    } catch (error) {
      if (error instanceof Error) {
        console.error("에러입니다.", error);
      }
    }
    setLoading(false);
  };

  // 페이지 변경시
  useEffect(() => {
    window.scrollTo(0, 0); // 페이지 이동시 스크롤 위치 제일 위로 초기화
    axios.get("http://localhost:8000/totalPage").then((res: any) => {
      setTotalItems(res.data.totalNumber);
    });
  }, [page]);
  useEffect(() => {
    fetchVideos("");
  }, [newCategory]);

  // video 목록 받은거 업데이트 하는 부분
  useEffect(() => {
    console.log("업데이트된 목록!!", videos);
  }, [videos]);

  // 스크롤 이벤트
  window.onscroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1
    ) {
      if (!loading && pageToken) {
        fetchVideos(pageToken);
      }
    }
  };

  ////////

  return (
    <div className="text-center">
      <h1>인기동영상</h1>
      <Row className="justify-content-center" style={{ width: "100%" }}>
        {videos.map((video: any) => (
          <Col xs={7} sm={7} md={5} lg={4} xl={3} xxl={2} key={video.id}>
            <Card style={{ width: "100%", marginBottom: "20px" }}>
              {selectedVideo === video.id ? (
                <iframe
                  id={`${video.id}`}
                  width="100%"
                  height="250px"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  frameBorder="0"
                  allowFullScreen
                  title="YouTube Video"
                />
              ) : (
                <>
                  <Card.Img
                    variant="top"
                    src={video.thumbnails}
                    onClick={() => setSelectedVideo(video.id)}
                  />
                </>
              )}
              <Link to="/page" state={{ data: video }} className="erText">
                <Card.Body>
                  <Card.Title>{video.channelTitle}</Card.Title>
                  <Card.Text className="cardText">{video.title}</Card.Text>
                  <div
                    style={{
                      color: "gray",
                      marginBottom: "10px",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {truncateText(video.description)
                      .split("\\n")
                      .map((line) => {
                        return (
                          <>
                            {line}
                            <br />
                          </>
                        );
                      })}
                  </div>
                  <div>
                    <div>
                      <div key={video.id}>
                        <div className="commentStyle">
                          <div style={{ marginBottom: "5px" }}>
                            <span style={{ marginRight: "3px" }}>👍</span>
                            {video.likeCount}
                          </div>{" "}
                          {truncateText(video.textOriginal)}
                        </div>
                      </div>

                      <button className="btn moreBtn">
                        <BsYoutube className="btnIcon" />
                        <Link
                          to="/page"
                          state={{ data: video }}
                          className="linkColor"
                        >
                          더보기
                        </Link>
                      </button>
                      <button className="btn clipBtn">
                        <BsFillPinFill className="btnIcon" />
                        스크랩
                      </button>
                    </div>
                  </div>
                </Card.Body>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>

      {loading && <Spinner animation="border" />}
      <Pagination
        activePage={page} // 현재 페이지
        itemsCountPerPage={12} // 한 페이지랑 보여줄 아이템 갯수
        totalItemsCount={totalItems} // 총 아이템 갯수
        pageRangeDisplayed={5} // paginator의 페이지 범위
        prevPageText={"‹"} // "이전"을 나타낼 텍스트
        nextPageText={"›"} // "다음"을 나타낼 텍스트
        onChange={handlePageChange} // 페이지 변경을 핸들링하는 함수
      />
    </div>
  );
}
