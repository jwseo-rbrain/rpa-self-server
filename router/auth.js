import express from "express";
import { body } from "express-validator";
import * as authController from "../controller/authController.js";
import * as checkController from "../plugins/check.js";

const router = express.Router();

// 로그인
router.post("/login", [
  body("userId").trim().notEmpty().withMessage("아이디를 입력하세요"),
  body("userPw").trim().notEmpty().withMessage("비밀번호를 입력하세요"),
  checkController.checkValidator,
  authController.loginUser,
]);

// 토큰 재발급
router.get("/refresh", [
  authController.tokenValidator,
  authController.refreshToken,
]);

// 토큰 검사
router.get("/check", [
  authController.tokenValidator,
  authController.checkToken,
]);

// 회원 가입
router.post("/join", [
  body("userId")
    .trim()
    .notEmpty()
    .withMessage("아이디를 입력하세요")
    .isLength({ min: 5, max: 15 })
    .withMessage("아이디는 최소 5글자 이상 15글자 미만으로 설정하세요"),
  body("userPw")
    .trim()
    .notEmpty()
    .withMessage("비밀번호를 입력하세요")
    .isLength({ min: 8, max: 20 })
    .withMessage("비밀번호는 최소 8글자 이상 20글자 미만으로 설정하세요")
    .custom(/[0-9]/.test)
    .withMessage("숫자를 포함해 주세요")
    .custom(/[A-Z]/.test)
    .withMessage("대문자를 포함해 주세요")
    .custom(/[~!@#$%^&*()_+|<>?:{}]/.test)
    .withMessage("특수 문자를 포함해 주세요"),
  body("userNm")
    .trim()
    .notEmpty()
    .withMessage("이름을 입력하세요")
    .isLength({ min: 3, max: 10 })
    .withMessage("이름은 3글자 이상 10글자 미만으로 입력하세요"),
  body("userEmail")
    .trim()
    .notEmpty()
    .withMessage("메일 주소를 입력하세요")
    .isEmail()
    .withMessage("메일 주소 형식으로 입력하세요"),
  checkController.checkValidator,
  authController.createUser,
]);

export default router;
