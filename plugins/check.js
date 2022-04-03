import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

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

export const checkTokenAndSetUser = (req, res, next) => {
  const authorization = req.header("Authorization");
  if (authorization && authorization.startsWith("Bearer")) {
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
      throw { status: 402, errors: { msg: "토큰 만료 재로그인 요망" } };
    }
    req.userInfo = payload;
    next();
  } else throw { status: 402, errors: { msg: "토큰 만료 재로그인 요망" } };
};
