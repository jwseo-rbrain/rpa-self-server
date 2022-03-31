import User from "../models/auth.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { config } from "dotenv";
config();

const { PW_SALT, JWT_SECRET } = process.env;

// 토큰 생성
const getToken = (userInfo) => {
  const { id, userId, userEmail, userNm } = userInfo;
  return jwt.sign({ id, userId, userNm, userEmail }, JWT_SECRET, {
    expiresIn: 60 * 30,
  });
};

/**
 * 유효성 검사
 */

// 로그인 유효성 검사
export const loginValidator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw {
      status: 401,
      errors: errors.array(),
    };
  next();
};

// 토큰 유효성 검사
export const tokenValidator = (req, res, next) => {
  const authorization = req.header("Authorization");
  if (!authorization || !authorization.startsWith("Bearer"))
    throw { status: 404, errors: { msg: "토큰 정보가 잘못되었습니다" } };

  const token = authorization.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.payload = payload;
    next();
  } catch (err) {
    throw { status: 402, errors: { msg: "토큰 만료 재로그인 요망" } };
  }
};

/**
 * 토큰 검사
 */
// 토큰 검사
export const checkToken = (req, res) => {
  return res.status(200).json({ msg: "토큰 유효함" });
};

// 토큰 재발급
export const refreshToken = async (req, res) => {
  const { userId, userEmail, userNm } = req.payload;
  const user = await User.findOne({ where: { userId, userEmail, userNm } });

  if (!user) throw { status: 404, errors: { msg: "유저 정보 없음" } };

  return res.status(200).json({
    token: getToken({ id: user.id, userId, userNm, userEmail }),
  });
};

/**
 * 회원가입 / 로그인
 */
// 회원 가입
export const createUser = async (req, res) => {
  const { userId, userPw, userNm, userEmail } = req.body;
  try {
    const user = await User.create({
      userId,
      userPw: bcrypt.hashSync(userPw, parseInt(PW_SALT)),
      userNm,
      userEmail,
    });

    res.status(200).json({
      msg: "회원 가입 완료",
      token: getToken({ id: user.id, userId, userNm, userEmail }),
    });
  } catch (err) {
    throw { status: 401, errors: { msg: "id 중복" } };
  }
};

// 로그인
export const loginUser = async (req, res) => {
  const user = await User.findOne({ where: { userId: req.body.userId } });

  if (!user) throw { status: 401, errors: { msg: "회원 정보 없음" } };
  const { id, userId, userEmail, userNm } = user;
  if (!bcrypt.compareSync(req.body.userPw, user.userPw))
    throw { status: 401, errors: { msg: "비번 다름" } };

  return res.status(200).json({
    token: getToken({ id, userId, userNm, userEmail }),
  });
};
