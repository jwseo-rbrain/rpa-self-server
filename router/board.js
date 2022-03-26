import express from "express";
import { body } from "express-validator";
import * as noticeController from "../controller/boardController.js";
import { tokenValidator } from "../controller/authController.js";
import Notice from "../models/notice.js";

const router = express.Router();

// 공지사항 등록
router.post("/notice", [
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
  noticeController.upload,
]);

// 공지사항 수정
router.put("/notice/:id", [
  tokenValidator,
  body("title")
    .trim()
    .notEmpty()
    .withMessage("제목을 입력하세요")
    .isLength({ min: 5, max: 30 })
    .withMessage("제목은 최소 5글자 이상 최대 30글자 까지"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("내용을 입력하세요")
    .isLength({ min: 5, max: 255 })
    .withMessage("내용은 최소 5글자 이상 최대 255글자 까지"),
  body("topYn")
    .optional({ nullable: true })
    .isBoolean()
    .withMessage("형식에 맞게 입력하세요 (true / false)"),
  body("visibleYn")
    .optional({ nullable: true })
    .isBoolean()
    .withMessage("형식에 맞게 입력하세요 (true / false)"),
  body("categoryPk")
    .optional({ nullable: true })
    .isInt()
    .withMessage("형식에 맞게 입력하세요 (int)"),
  noticeController.checkValidator,
  noticeController.update,
]);

// 공지사항 리스트
router.post("/notice/list", [
  tokenValidator,
  body("isTopYn")
    .optional({ nullable: true })
    .isBoolean()
    .withMessage("형식에 맞게 입력하세요 (true / false)"),
  body("latest")
    .optional({ nullable: true })
    .isBoolean()
    .withMessage("형식에 맞게 입력하세요 (true / false)"),
  body("categoryPk")
    .optional({ nullable: true })
    .isInt()
    .withMessage("형식에 맞게 입력하세요 int"),
  body("dateType")
    .optional({ nullable: true })
    .custom((val) => /CREATE|UPDATE/.test(val))
    .withMessage("정해진 키워드를 입력하세요 (CREATE / UPDATE)"),
  body("startDate")
    .optional({ nullable: true })
    .isDate()
    .withMessage("날짜 형식에 맞게 입력하세요 (YYYY-MM-DD)"),
  body("endDate")
    .optional({ nullable: true })
    .isDate()
    .withMessage("날짜 형식에 맞게 입력하세요 (YYYY-MM-DD)"),
  body("startId")
    .optional({ nullable: true })
    .isInt()
    .withMessage("형식에 맞게 입력하세요 (int)"),
  body("itemCnt")
    .optional({ nullable: true })
    .isInt()
    .withMessage("형식에 맞게 입력하세요 (int)"),
  body("scope")
    .optional({ nullable: true })
    .custom(/PUBLIC|PRIVATE/.test)
    .withMessage("형식에 맞게 입력하세요 (PUBLIC / PRIVATE)"),
  body("searchBy")
    .optional({ nullable: true })
    .custom(/TITLE|CONTENT/.test)
    .withMessage("형식에 맞게 입력하세요 (TITLE / CONTENT)"),
  noticeController.checkValidator,
  noticeController.getList,
]);

export default router;
