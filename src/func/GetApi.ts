import axios from "axios";
// import jwt from "jsonwebtoken";
const apiKey = process.env.REACT_APP_APIKEY;
//댓글 가져오기
const fetchComments = async (
  videoId: string,
  commentNumber: number,
  token: string
) => {
  try {
    const res = await axios.get(
      "https://www.googleapis.com/youtube/v3/commentThreads",
      {
        params: {
          key: apiKey,
          part: "snippet,replies",
          videoId: videoId,
          maxResults: commentNumber,
          order: "relevance",
          pageToken: token,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log("댓글오류");
    return null;
  }
};

// 통계값 가져오기
const getStatistics = async (videoId: String) => {
  try {
    const res = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          key: apiKey,
          part: "statistics",
          id: videoId,
        },
      }
    );
    // 응답 처리
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

//검색어 입력받은거 가져오기
const searchYoutubeVideos = async (query: string, pageToken: string) => {
  try {
    const result = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          key: apiKey,
          type: "video",
          part: "snippet",
          q: query, //query가 검색부분임
          maxResults: 12,
          pageToken: pageToken,
        },
      }
    );
    console.log("검색데이터 받아온 결과값", result.data);
    return result;
  } catch (error) {
    console.log("검색에러", error);
  }
};
//댓글 가져오기
//글자수 제한 함수
function truncateText(text: string) {
  if (text.length <= 50) {
    return text;
  } else {
    const sliceText = text.slice(0, 50) + "...";
    return sliceText;
  }
}
function getCookie(key: string, data: any) {
  const token = data;
  // 만료날짜 설정
  const expires = new Date();
  expires.setTime(expires.getTime() + 2 * 60 * 60 * 1000);
  // 쿠키 설정 (path 설정 = 쿠키가 적용되는 경로지정)
  document.cookie = `${key} = ${token}; expires=${expires.toUTCString()} path=/`;
  window.location.href = "/";
}
function deleteCookie() {
  document.cookie =
    "token" + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
export {
  fetchComments,
  truncateText,
  searchYoutubeVideos,
  getCookie,
  getStatistics,
  deleteCookie,
};
