import express, { Express, Request, Response } from "express";
import router from "./routes/index";
import cors from "cors";

const app: Express = express();
const PORT: Number = 8000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//JSON 형식 POST 데이터 파싱하기 위한 미들웨어 추가
app.use(express.json());
// 라우터 설정
app.use("/", router);

app.get("*", (req: Request, res: Response) => {
  res.render("404");
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
