import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const Notice = sequelize.define(
  "notice",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    categoryPk: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(125),
      allowNull: false,
    },
    topYn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    visibleYn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  { timestamps: true }
);

export default Notice;
