import Model from "../model/index";
import axios from "axios";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
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
          maxResults: 50,
          videoCategoryId: 0,
          regionCode: "KR",
          pageToken: "",
        },
      }
    );
    const saveResult = await Model.saveVideos(result.data.items);
    res.send("Success");
  } catch (error) {
    console.error("에러입니다.", error);
  }
};

const trend = async (req: Request, res: Response) => {
  try {
    const result = await Model.getTrendingVideos();
    res.send(result);
  } catch (error) {}
};
export default { main, test, getVideos, trend };
