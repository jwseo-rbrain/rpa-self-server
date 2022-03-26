import express from "express";
import { body } from "express-validator";
import * as noticeController from "../controller/boardController.js";
import { tokenValidator } from "../controller/authController.js";

const router = express.Router();

// 공지사항 등록
router.post(
  "/notice",
  [
    tokenValidator,
    body("title")
      .trim()
      .notEmpty()
      .withMessage("제목을 입력해주세요")
      .isLength({ min: 3, max: 30 })
      .withMessage("제목은 3글자 이상 30글자 미만"),
    body("content")
      .trim()
      .notEmpty()
      .withMessage("내용을 입력해주세요")
      .isLength({ min: 3, max: 255 })
      .withMessage("내용은 3글자 이상 255글자 미만"),
    noticeController.checkValidator,
  ],
  noticeController.upload
);

// 공지사항 리스트
router.post("/notice/list", tokenValidator, noticeController.getList);

// 공지사항 수정

export default router;
