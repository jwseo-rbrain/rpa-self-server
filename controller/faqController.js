import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import Faq from "../models/faq.js";
import { Op } from "sequelize";

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

export const upload = async (req, res) => {
  const { id } = req.userInfo;
  req.body.userId = id;
  const faq = await Faq.create(req.body);
  return res.status(200).json({ msg: "Faq 업로드 성공!", data: faq });
};

export const read = async (req, res) => {
  const faqId = req.params.id;
  const faq = await Faq.findOne({ where: { id: faqId } });
  if (!faq) throw { status: 404, errors: { msg: `Faq 없음 (pk: ${faqId})` } };
  return res.status(200).json({ msg: "Faq GET 성공!", data: faq });
};

export const update = async (req, res) => {
  const faqId = req.params.id;
  const faq = await Faq.update(req.body, { where: { id: faqId } });
  if (!faq)
    throw { status: 404, errors: { msg: `수정할 Faq 없음 (pk: ${faqId})` } };
  return res.status(200).json({ msg: "Faq 업데이트 성공!", data: faq });
};

export const remove = async (req, res) => {
  const faqId = req.params.id;
  const result = await Faq.destroy({ where: { id: faqId } });
  if (!result)
    throw { status: 404, errors: { msg: `Faq 삭제 실패 (pk : ${faqId})` } };
  return res.status(200).json({ msg: "Faq 삭제 성공" });
};

export const getList = async (req, res) => {
  const {
    dateType,
    startDate,
    endDate,
    searchBy,
    searchValue,
    latest,
    startId,
    itemCnt,
  } = req.body;
  const filter = { where: {}, order: [] };

  if (dateType) {
    filter.where[`${dateType.toLowerCase()}dAt`] = {
      [Op.gte]: startDate,
      [Op.lte]: endDate,
    };
  }
  if (searchBy) {
    filter.where[`${searchBy.toLowerCase()}`] = {
      [Op.like]: `%${searchValue}%`,
    };
  }
  if (typeof latest === "boolean") {
    filter.order = [["id", latest ? "DESC" : "ASC"]];
  }
  if (startId) {
    filter.where.id = {
      ...filter.where.id,
      ...{ [Op.gte]: startId },
    };
  }
  if (itemCnt) {
    filter.where.id = {
      ...filter.where.id,
      ...{ [Op.lte]: startId ? startId + itemCnt : itemCnt },
    };
  }
  const faqs = await Faq.findAll(filter);
  if (!faqs)
    throw {
      status: 404,
      errors: { msg: `Faq List GET Error! (payload: ${req.body})` },
    };
  return res.status(200).json({ msg: "Faq List GET 성공!", data: faqs });
};
