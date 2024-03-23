import express from "express";
import controller from "../controller/index";
const router = express.Router();

router.get("/", controller.main);
router.post("/test", controller.test);
router.get("/getVideos", controller.getVideos); //유튜브 api로 데이터 받아오는거
router.post("/trending", controller.trend); //인기순
router.post("/getComments", controller.getComments);
router.post("/getCount", controller.getCount);
export default router;
