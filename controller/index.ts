import Model from "../model/index";
import { Pool } from "mysql2/promise";
import { Request, Response } from "express";
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
export default { main, test };
