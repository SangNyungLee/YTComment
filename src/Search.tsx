import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Col, Row, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/Search.css";
import Spinner from "react-bootstrap/Spinner";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { BsYoutube, BsFillPinFill } from "react-icons/bs";
import {
  fetchComments,
  truncateText,
  searchYoutubeVideos,
} from "./func/GetApi";
import { RootState } from "./store";
//API키
export default function Search() {
  const apiKey = "AIzaSyBrSPFESYjexkwyDYm99UyIPhBXWtcxK4U";
  const [videos, setVideos] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [pageToken, setPageToken] = useState("");
  const [commentData, setCommentData] = useState<any>({});
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [categoryNumber, setCategoryNumber] = useState<number | null>(null);
  const location = useLocation();
  const recData = location.state.data;
  const newCategory = useSelector(
    (state: RootState) => state.category.category
  );

  const fetchVideos = async (token: string) => {
    setLoading(true);
    try {
      setVideos([]);
      const res: any = await searchYoutubeVideos(recData, token);
      //댓글 불러오기
      const newVideos = res.data.items;
      if (categoryNumber === null || categoryNumber !== newCategory) {
        setCategoryNumber(newCategory);
        setVideos([...newVideos]);
      } else {
        setVideos([...videos, ...newVideos]);
      }
      setPageToken(res.data.nextPageToken);
    } catch (error) {
      if (error instanceof Error) {
        console.error("에러입니다.", error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos("");
  }, [newCategory]);

  useEffect(() => {
    async function fetchCommentsForVideos() {
      const comments = [];
      for (const video of videos) {
        const videoId = video.id.videoId;
        const commentInfo = await fetchComments(videoId, 2, "");
        comments[videoId] = commentInfo;
      }
      setCommentData(comments);
    }
    if (videos.length > 0) {
      console.log("videos", videos);
      fetchCommentsForVideos();
    }
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
          <Col
            xs={7}
            sm={7}
            md={5}
            lg={4}
            xl={3}
            xxl={2}
            key={video.id.videoId}
          >
            <Card style={{ width: "100%", marginBottom: "20px" }}>
              {selectedVideo === video.id.videoId ? (
                <iframe
                  id={`${video.id.videoId}`}
                  width="100%"
                  height="250px"
                  src={`https://www.youtube.com/embed/${video.id.videoId}`}
                  frameBorder="0"
                  allowFullScreen
                  title="YouTube Video"
                />
              ) : (
                <>
                  <Card.Img
                    variant="top"
                    src={video.snippet.thumbnails.high.url}
                    onClick={() => setSelectedVideo(video.id.videoId)}
                  />
                </>
              )}
              <Link to="/searchPage" state={{ data: video }} className="erText">
                <Card.Body>
                  <Card.Title>{video.snippet.channelTitle}</Card.Title>
                  <Card.Text className="cardText">
                    {video.snippet.title}
                  </Card.Text>
                  <div style={{ color: "gray", marginBottom: "10px" }}>
                    {truncateText(video.snippet.description)}
                  </div>

                  {commentData[video.id.videoId] && (
                    <div>
                      <div>
                        {commentData[video.id.videoId].items.map(
                          (comment: any) => (
                            <div key={comment.id}>
                              <div className="commentStyle">
                                <div style={{ marginBottom: "5px" }}>
                                  <span style={{ marginRight: "3px" }}>👍</span>
                                  {
                                    comment.snippet.topLevelComment.snippet
                                      .likeCount
                                  }
                                </div>{" "}
                                {
                                  comment.snippet.topLevelComment.snippet
                                    .textOriginal
                                }
                              </div>
                            </div>
                          )
                        )}

                        <button className="btn moreBtn">
                          <BsYoutube className="btnIcon" />
                          <Link
                            to="/searchPage"
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
                  )}
                </Card.Body>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>

      {loading && <Spinner animation="border" />}
    </div>
  );
}
