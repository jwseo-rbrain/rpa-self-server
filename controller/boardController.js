import Notice from "../models/notice.js";
import { Op } from "sequelize";
import { validationResult } from "express-validator";

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
  try {
    await Notice.create(req.body);
    res.status(200).json({ msg: "공지사항 등록 성공!" });
  } catch (err) {
    throw { status: 404, errors: { msg: "공지사항 등록 실패!" } };
  }
};

export const getList = async (req, res) => {
  const {
    isTopYn,
    latest,
    categoryPk,
    scope,
    startId,
    itemCnt,
    dateType,
    startDate,
    endDate,
    searchBy,
    searchValue,
  } = req.body;
  try {
    const filter = { where: {}, order: [] };
    if (dateType) {
      filter.where[`${dateType.toLowerCase()}dAt`] = {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      };
    }
    if (searchBy)
      filter.where[searchBy.toLowerCase()] = {
        [Op.like]: `%${searchValue}%`,
      };
    if (typeof latest === "boolean")
      filter.order.push(["id", latest ? "ASC" : "DESC"]);
    if (typeof isTopYn === "boolean")
      filter.order.push(["topYn", isTopYn ? "DESC" : "ASC"]);
    if (typeof categoryPk === "number") filter.where.categoryPk = categoryPk;
    if (typeof scope === "string") filter.where.visibleYn = scope === "PUBLIC";
    if (typeof startId === "number") filter.offset = startId;
    if (typeof itemCnt === "number") filter.limit = itemCnt;

    const result = await Notice.findAll(filter);
    const list = result.map((r) => r.dataValues);
    return res.status(200).json({ data: list, total: list.length });
  } catch (err) {
    throw { status: 404, errors: { msg: "DB Filter 에러" } };
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { title, content, topYn, visibleYn, categoryPk } = req.body;
  const payload = {};
  if (typeof title === "string") payload.title = title;
  if (typeof content === "string") payload.content = content;
  if (typeof topYn === "boolean") payload.topYn = topYn;
  if (typeof visibleYn === "boolean") payload.visibleYn = visibleYn;
  if (typeof categoryPk === "number") payload.categoryPk = categoryPk;
  try {
    await Notice.update(payload, { where: { id } });
    return res.status(200).json({ msg: "공지사항 수정 성공" });
  } catch (err) {
    throw { status: 404, errors: { msg: "공지사항 수정 실패" } };
  }
};
