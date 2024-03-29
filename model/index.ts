import { createPool } from "mysql2/promise";
import { fetchComments } from "../src/func/GetApi";

const conn = createPool({
  host: "localhost",
  user: "test",
  password: "1234",
  database: "ytcomment",
});

async function testQuery() {
  try {
    const [rows, fields] = await conn.query("SELECT * FROM userinfos");
    return rows;
  } catch (error) {
    console.error("에러!!", error);
  }
}

// 댓글 db에 저장
async function saveComments(data: any) {
  for (const item of data) {
    const commentInfo = await fetchComments(item.id, 10, "");
    for (const comment of commentInfo.items) {
      const comments = comment.snippet.topLevelComment.snippet;
      await conn.query(
        `INSERT INTO comment(videoId, likeCount, textOriginal, authorName, authorProfileImageUrl, publishedAt)
      VALUES (?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          comments.likeCount,
          comments.textOriginal,
          comments.authorDisplayName,
          comments.authorProfileImageUrl,
          comments.publishedAt,
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
      INSERT INTO channelinfo (id, channelTitle, title, description, thumbnails, channelId, tags, categoryId, publishedAt)
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
      `INSERT INTO statistics (id, channelViewCount, channelFavoriteCount, channelCommentCount, channelLikeCount)
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
    console.log("success");
  }
  try {
  } catch (error) {
    console.error("에러", error);
  }
}
// Trending Video DB에서 꺼내오고, 댓글 중에서 likeCount가 제일 높은 값만 가져오게 JOIN
async function getTrendingVideos() {
  const [rows, fields] = await conn.query(`SELECT T1.*, T2.*
  FROM channelinfo AS T1
  INNER JOIN (
      SELECT *, ROW_NUMBER() OVER (PARTITION BY videoId ORDER BY likeCount DESC) AS row_num
      FROM comment
  ) AS T2 ON T1.id = T2.videoId
  WHERE T2.row_num = 1;`);
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
    const [rows, _] = await conn.query(
      "INSERT INTO userinfo (userEmail, userName, userPw) VALUES (?,?,?)",
      [data.userEmail, data.userName, data.userPw]
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
        "INSERT INTO userinfo (userEmail, userName, userPw) VALUES(?, ?, ?)",
        [data.id, data.kakao_account.profile.nickname, "kakaoLogin"]
      );
      console.log("가입완료");
    } else {
      console.log("이미가입");
    }
  } catch (error) {
    console.log("카카오 로그인 오류", error);
  }
}

// 로그인 확인 함수
async function login(data: any) {
  try {
    const [rows, _]: any = await conn.query(
      "SELECT userEmail, userName FROM userinfo where (userEmail, userPw) = (?, ?)",
      [data.userId, data.userPw]
    );
    return rows;
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
  testQuery,
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
