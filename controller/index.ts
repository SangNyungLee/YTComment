import Model from "../model/index";
import axios from "axios";
import { Request, Response } from "express";
import { fetchComments } from "../src/func/GetApi";
import jwt from "jsonwebtoken";
const apiKey = "AIzaSyBrSPFESYjexkwyDYm99UyIPhBXWtcxK4U";
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
    console.log("받은값", req.body);
    const Queryresult = await Model.testQuery();
    res.send(Queryresult);
  } catch (error) {
    console.error("에러!!", error);
  }
};

const getVideos = async (req: Request, res: Response) => {
  try {
    const result = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          key: apiKey,
          part: "snippet, statistics",
          chart: "mostPopular",
          maxResults: 12,
          videoCategoryId: 0,
          regionCode: "KR",
          pageToken: "",
        },
      }
    );
    await Model.saveVideos(result.data.items);
    await Model.saveComments(result.data.items);
    res.send("Success");
  } catch (error) {
    console.error("에러입니다.", error);
  }
};

const trend = async (req: Request, res: Response) => {
  try {
    const result = await Model.getTrendingVideos();
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
    console.log("AUTH로 온 값", req.body);
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
    console.log("JWT 토큰", token);
    res.send(token);
  } catch (error) {
    console.log("error", error);
  }
};
const login = async (req: Request, res: Response) => {
  try {
    console.log("로그인", req.body);
    const result = await Model.login(req.body);
    console.log("받아온거 결과??", result);
    if (result.length === 0) {
      res.send("fail");
    } else {
      const user = {
        id: result[0].userEmail,
        username: result[0].userName,
      };
      const secretKey = "secret"; // 비밀키
      const expiresIn = "2h"; // 만료시간
      const token = jwt.sign(user, secretKey, { expiresIn });
      console.log("JWT 토큰", token);
      res.send(token);
    }
  } catch (error) {
    console.log("controller 로그인 오류", error);
  }
};

const totalPage = async (req: Request, res: Response) => {
  try {
    const result: any = await Model.totalPage();
    console.log(result[0].totalNumber);
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
