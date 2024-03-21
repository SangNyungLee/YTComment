import { createPool } from "mysql2/promise";

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

// api로 받아온거 저장하는 함수
async function saveVideos(data: any) {
  for (const item of data) {
    const tagString = JSON.stringify(item.snippet.tags);
    const desString = JSON.stringify(item.snippet.description);
    const result = await conn.query(
      `
      INSERT INTO channelinfo (id, channelTitle, title, description, thumbnails, channelId, tags, categoryId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        item.id,
        item.snippet.channelTitle,
        item.snippet.title,
        desString,
        item.snippet.thumbnails.default.url,
        item.snippet.channelId,
        tagString,
        item.snippet.categoryId,
      ]
    );
    console.log("success");
  }
  try {
  } catch (error) {
    console.error("에러", error);
  }
}
// Trending Video DB에서 꺼내오는거
async function getTrendingVideos() {
  const [rows, fields] = await conn.query(`SELECT * FROM channelinfo`);
  return rows;
}
export default { conn, testQuery, saveVideos, getTrendingVideos };
