import { createPool } from "mysql2/promise";

const conn = createPool({
  host: "localhost",
  user: "users",
  password: "1234",
  database: "kdt9",
});

async function testQuery() {
  try {
    const [rows, fields] = await conn.query("SELECT * FROM userinfos");
    console.log("쿼리 결과", rows);
    console.log("필드값", fields);
    return rows;
  } catch (error) {
    console.error("에러!!", error);
  }
}
export default { conn, testQuery };
