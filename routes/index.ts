import express from "express";
import controller from "../controller/index";
const router = express.Router();

router.get("/", controller.main);
router.post("/test", controller.test);
export default router;
