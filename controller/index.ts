import Model from "../model/index";
import axios from "axios";
import { Request, Response } from "express";
import { fetchComments } from "../src/func/GetApi";
import jwt from "jsonwebtoken";
import cron from "node-cron";
const apiKey = process.env.REACT_APP_APIKEY;
const main = async (req: Request, res: Response) => {
  try {
    await Model.conn.query("SELECT 1");
    res.render("index");
  } catch (error) {
    console.error("Error MYSQL query", error);
    res.status(500).send("Error");
  }
};
const test = async (req: Request, res: Response) => {
  try {
    const Queryresult = await Model.testQuery();
    res.send(Queryresult);
  } catch (error) {
    console.error("에러!!", error);
  }
};

// 매일 자정에 schedule 실행
// const getVideos = async () => {
//   const category = [0, 10, 20, 15]; // 최신, 음악, 게임, 동물 순서임
//   for (const data of category) {
//     try {
//       const result = await axios.get(
//         "https://www.googleapis.com/youtube/v3/videos",
//         {
//           params: {
//             key: apiKey,
//             part: "snippet, statistics",
//             chart: "mostPopular",
//             maxResults: 50,
//             videoCategoryId: data,
//             regionCode: "KR",
//           },
//         }
//       );
//       if (result.data && result.data.items) {
//         await Model.saveVideos(result.data.items);
//         await Model.saveComments(result.data.items);
//       }
//       console.log("Success");
//     } catch (error) {
//       console.error("에러입니다.", error);
//     }
//   }
// };

cron.schedule(
  "0 0 * * * *",
  async () => {
    await getVideos();
    console.log("매일 자정에 동영상 데이터 수집 완료");
  },
  {
    timezone: "Asia/Seoul",
  }
);

const getVideos = async () => {
  const category = [0, 10, 20, 15]; // 최신, 음악, 게임, 동물 순서임
  for (const data of category) {
    try {
      const result = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: {
            key: apiKey,
            part: "snippet, statistics",
            chart: "mostPopular",
            maxResults: 50,
            videoCategoryId: data,
            regionCode: "KR",
          },
        }
      );
      if (result.data && result.data.items) {
        await Model.saveVideos(result.data.items);
        await Model.saveComments(result.data.items);
      }
      console.log("DB저장 완료");
    } catch (error) {
      console.log("에러입니다.");
    }
  }
};

const trend = async (req: Request, res: Response) => {
  try {
    const result = await Model.getTrendingVideos(req.body);
    res.send(result);
  } catch (error) {
    console.error("불러오기오류", error);
  }
};

const getComments = async (req: Request, res: Response) => {
  try {
    const result = await Model.getComments(req.body.id);
    res.send(result);
  } catch (error) {
    console.error("댓글 받아오기 오류", error);
  }
};
const getCount = async (req: Request, res: Response) => {
  try {
    const result = await Model.getCount(req.body.id);
    res.send(result);
  } catch (error) {
    console.error("count 받아오기 오류", error);
  }
};

// 이메일 중복확인
const checkUserEmail = async (req: Request, res: Response) => {
  try {
    const result: any = await Model.checkUserEmail(req.body.userEmail);
    if (result.length === 0) {
      res.send("success");
    } else {
      res.send("중복된 이메일 입니다.");
    }
  } catch (error) {
    console.error("이메일 에러", error);
  }
};

//회원가입
const userSignup = async (req: Request, res: Response) => {
  try {
    const result: any = await Model.userSignup(req.body);
    if (result) {
      res.send("success");
    } else {
      return "error";
    }
  } catch (error) {
    console.error("회원가입오류", error);
  }
};
const kakao = async (req: Request, res: Response) => {
  try {
    const accessToken = req.body.Token;
    const headers = {
      Authorization: `bearer ${accessToken}`,
    };

    // 카카오 API 호출
    const result = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers,
    });
    // 가입되어 있는지 확인
    await Model.kakao(result.data);
    // jsonWebToken 만들어서 보내기

    const user = {
      id: result.data.id,
      username: result.data.kakao_account.profile,
    };
    const secretKey = "secret"; // 비밀키
    const expiresIn = "2h"; // 만료시간
    const token = jwt.sign(user, secretKey, { expiresIn });
    const data = { token: token, user: user };
    res.send(data);
  } catch (error) {
    console.log("error", error);
  }
};
const login = async (req: Request, res: Response) => {
  try {
    const result = await Model.login(req.body);
    if (result.length === 0 || result === "fail") {
      res.send("fail");
    } else {
      const user = {
        id: result.userEmail,
        username: result.userName,
      };
      const secretKey = "secret"; // 비밀키
      const expiresIn = "2h"; // 만료시간
      const token = jwt.sign(user, secretKey, { expiresIn });
      const data = { token: token, user: user };
      res.send(data);
    }
  } catch (error) {
    console.log("controller 로그인 오류", error);
    res.send("fail");
  }
};

const totalPage = async (req: Request, res: Response) => {
  try {
    const result: any = await Model.totalPage();
    res.send({ totalNumber: result[0].totalNumber });
  } catch (error) {
    console.log("totalPage 오류", error);
  }
};
export default {
  main,
  test,
  getVideos,
  trend,
  getComments,
  getCount,
  checkUserEmail,
  userSignup,
  kakao,
  login,
  totalPage,
};
