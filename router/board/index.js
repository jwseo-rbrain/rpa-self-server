import express from "express";
import NoticeRouter from "./notice.js";
import FaqRouter from "./faq.js";

const router = express.Router();

router.use("/notice", NoticeRouter);
router.use("/faq", FaqRouter);

export default router;
