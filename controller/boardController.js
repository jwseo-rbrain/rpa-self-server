import Notice from "../models/notice.js";
import { Op } from "sequelize";

export const upload = async (req, res) => {
  try {
    await Notice.create(req.body);
    res.status(200).json({ msg: "공지사항 등록 성공!" });
  } catch (err) {
    throw { status: 404, errors: { msg: "공지사항 등록 실패!", err } };
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

    const result = await Notice.findAll(filter);
    const list = result.map((r) => r.dataValues);
    return res.status(200).json({ total: list.length, data: list });
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

export const detail = async (req, res) => {
  try {
    const data = await Notice.findByPk(req.params.id);
    if (!data)
      throw {
        status: 404,
        errors: { msg: "공지사항 정보 가져오던 중 에러 발생" },
      };
    return res.status(200).json({ data });
  } catch (err) {
    throw {
      status: 404,
      errors: { msg: "공지사항 정보 가져오던 중 에러 발생", err },
    };
  }
};

export const remove = async (req, res) => {
  try {
    const result = await Notice.destroy({ where: { id: req.params.id } });
    if (!result)
      throw { status: 404, errors: { msg: "공지사항 삭제중 오류 발생" } };
    return res.status(200).json({ msg: "게시글 삭제 완료" });
  } catch (err) {
    throw { status: 404, errors: { msg: "공지사항 삭제중 오류 발생", err } };
  }
};
