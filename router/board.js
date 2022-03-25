import express from "express";
import Notice from "../models/notice.js";
import { body, validationResult } from "express-validator";

const router = express.Router();
// 유효성 검사
export const checkValidator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw {
      status: 401,
      errors: errors.array(),
    };
  }
  next();
};

router.post(
  "/notice",
  [
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
    checkValidator,
  ],
  async (req, res) => {
    try {
      await Notice.create(req.body);
      res.status(200).json({ msg: "공지사항 등록 성공!" });
    } catch (err) {
      throw { status: 404, errors: { msg: "공지사항 등록 실패!" } };
    }
  }
);

export default router;
