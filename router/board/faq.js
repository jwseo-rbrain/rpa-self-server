import express from "express";
import { body } from "express-validator";
import { config } from "dotenv";
import * as faqController from "../../controller/faqController.js";
config();

const router = express.Router();

// upload
router.post(
  "/",
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
    body("visibleYn")
      .optional({ nullable: true })
      .isBoolean()
      .withMessage("형식에 맞게 입력하세요 (true / false)"),
    faqController.checkValidator,
    faqController.checkTokenAndSetUser,
  ],
  faqController.upload
);

// read
router.get("/:id", faqController.read);

// // update
router.put("/:id", faqController.checkTokenAndSetUser, faqController.update);

// delete
router.delete("/:id", faqController.checkTokenAndSetUser, faqController.remove);

// get list
router.post(
  "/list",
  [
    body("dateType")
      .optional({ nullable: true })
      .trim()
      .custom((val) => /CREATE|UPDATE/.test(val))
      .withMessage("형식에 맞게 입력하세요 (CREATE / UPDATE)"),
    body("startDate")
      .optional({ nullable: true })
      .trim()
      .isDate()
      .withMessage("날짜 형식으로 입력해주세요 (YYYY-MM-DD)"),
    body("endDate")
      .optional({ nullable: true })
      .trim()
      .isDate()
      .withMessage("날짜 형식으로 입력해주세요 (YYYY-MM-DD)"),
    body("searchBy")
      .optional({ nullable: true })
      .trim()
      .custom((val) => /TITLE|CONTEN/.test(val))
      .withMessage("형식에 맞게 입력하세요 (TITLE / CONETNT)"),
    body("searchValue")
      .optional({ nullable: true })
      .trim()
      .isString()
      .withMessage("형식에 맞게 입력해주세요 (STRING)"),
    body("itemCnt")
      .optional({ nullable: true })
      .isInt()
      .withMessage("형식에 맞게 입력 하세요 (INT)"),
    body("latest")
      .optional({ nullable: true })
      .isBoolean()
      .withMessage("형식에 맞게 입력하세요 (BOOLEAN)"),
    body("startId")
      .optional({ nullable: true })
      .isInt()
      .withMessage("형식에 맞게 입력 학세요 (INT)"),
    faqController.checkValidator,
  ],
  faqController.getList
);

export default router;
