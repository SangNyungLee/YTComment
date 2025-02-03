import { createPool } from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();
const salt = 10;

const conn = createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "ytcomment",
});

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
          key: process.env.REACT_APP_APIKEY,
          part: "snippet",
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
// 댓글 db에 저장
async function saveComments(data: any) {
  for (const item of data) {
    const commentInfo = await fetchComments(item.id, 10, "");
    if (!commentInfo || !commentInfo.items) {
      console.log("댓글없음");
      continue;
    }
    for (const comment of commentInfo.items) {
      const comments = comment.snippet.topLevelComment.snippet;

      const formattedPublishedAt = comments.publishedAt
        .replace("T", " ")
        .replace("Z", "");

      await conn.query(
        `INSERT INTO comment(videoId, likeCount, textOriginal, authorName, authorProfileImageUrl, publishedAt)
      VALUES (?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          comments.likeCount,
          comments.textOriginal,
          comments.authorDisplayName,
          comments.authorProfileImageUrl,
          formattedPublishedAt,
        ]
      );
    }
  }
}

// api로 받아온거 저장하는 함수
async function saveVideos(data: any) {
  for (const item of data) {
    const tagString = JSON.stringify(item.snippet.tags);
    const desString = JSON.stringify(item.snippet.description);
    await conn.query(
      `
      INSERT IGNORE INTO channelinfo (id, channelTitle, title, description, thumbnails, channelId, tags, categoryId, publishedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        item.id,
        item.snippet.channelTitle,
        item.snippet.title,
        desString,
        item.snippet.thumbnails.standard.url,
        item.snippet.channelId,
        tagString,
        item.snippet.categoryId,
        item.snippet.publishedAt,
      ]
    );
    await conn.query(
      `INSERT IGNORE INTO statistics (id, channelViewCount, channelFavoriteCount, channelCommentCount, channelLikeCount)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        item.id,
        item.statistics.viewCount,
        item.statistics.favoriteCount,
        item.statistics.commentCount,
        item.statistics.likeCount,
      ]
    );
  }
  try {
  } catch (error) {
    console.error("에러", error);
  }
}
// Trending Video DB에서 꺼내오고, 댓글 중에서 likeCount가 제일 높은 값만 가져오게 JOIN
async function getTrendingVideos(data: any) {
  const itemsPerPage = 12; // 한 페이지당 12개씩 가져올거임
  const startIndex = (data.page - 1) * itemsPerPage; // 페이지당 아이템수 계산해서 시작 인덱스 계산
  let sqlQuery = `
  SELECT T1.*, T2.*
  FROM channelinfo AS T1
  LEFT JOIN (
      SELECT *, ROW_NUMBER() OVER (PARTITION BY videoId ORDER BY likeCount DESC) AS row_num
      FROM comment
  ) AS T2 ON T1.id = T2.videoId AND (T2.row_num = 1 OR T2.row_num IS NULL)
`;

  // newCategory가 0이 아닌 경우에만 categoryId 조건을 추가
  if (data.newCategory !== 0) {
    sqlQuery += ` WHERE T1.categoryId = ${data.newCategory}`;
  }

  sqlQuery += ` LIMIT ${startIndex}, ${itemsPerPage}`;

  const [rows, fields] = await conn.query(sqlQuery);
  return rows;
}

// Page에 Comment값이랑 statistics 조인해서 보내주는 쿼리
async function getComments(id: string) {
  try {
    const [rows, fields] = await conn.query(
      `SELECT * FROM comment where videoId = "${id}"
      `
    );
    return rows;
  } catch (error) {
    console.log("Comment 값 오류", error);
  }
}

async function getCount(id: String) {
  try {
    const [rows, fields] = await conn.query(
      `SELECT * FROM statistics where id = "${id}"`
    );
    return rows;
  } catch (error) {
    console.error("statistics값 받아오기 오류", error);
  }
}

async function checkUserEmail(email: String) {
  try {
    const [rows, _] = await conn.query(
      `SELECT * FROM userinfo where userEmail = ?`,
      [email]
    );
    return rows;
  } catch (error) {
    console.error("이메일 오류", error);
  }
}
async function userSignup(data: any) {
  try {
    // 비밀번호 암호화 시키기
    const hash = bcrypt.hashSync(data.userPw, salt);
    const [rows, _] = await conn.query(
      "INSERT INTO userinfo (userEmail, userName, userPw, social) VALUES (?,?,?,?)",
      [data.userEmail, data.userName, hash, "homepage"]
    );
    return rows;
  } catch (error) {
    console.error("회원가입쿼리오류", error);
  }
}
async function kakao(data: any) {
  try {
    // 이미 가입되어 있는 아이디인지 확인
    const [rows, _]: any = await conn.query(
      "SELECT * FROM userinfo where userEmail=?",
      [data.id]
    );
    if (rows.length === 0) {
      // 가입 안되어 있으면 가입 시킴
      await conn.query(
        "INSERT INTO userinfo (userEmail, userName, userPw, social) VALUES(?, ?, ?, ?)",
        [data.id, data.kakao_account.profile.nickname, "kakaoLogin", "kakao"]
      );
      console.log("가입완료");
    } else {
      console.log("이미 가입된 유저");
    }
  } catch (error) {
    console.log("카카오 로그인 오류", error);
  }
}

// 로그인 확인 함수
async function login(data: any) {
  try {
    const [rows, _]: any = await conn.query(
      "SELECT userEmail, userName, userPw FROM userinfo where (userEmail) = (?)",
      [data.userId]
    );
    const match = await bcrypt.compare(data.userPw, rows[0].userPw);
    if (match) {
      data = { userEmail: rows[0].userEmail, userName: rows[0].userName };
      return data;
    } else {
      return "fail";
    }
  } catch (error) {
    console.log("로그인 오류", error);
  }
}

const totalPage = async () => {
  try {
    const [rows, _] = await conn.query(
      "SELECT COUNT(*) AS totalNumber FROM channelinfo"
    );
    return rows;
  } catch (error) {
    console.log("totalPage 오류", error);
  }
};
export default {
  conn,
  saveVideos,
  getTrendingVideos,
  saveComments,
  getComments,
  getCount,
  checkUserEmail,
  userSignup,
  kakao,
  login,
  totalPage,
};
