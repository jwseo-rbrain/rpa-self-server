import moment from "moment";
import { DataTypes } from "sequelize";
import sequelize from "./index.js";
import User from "./auth.js";

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
    createdAt: {
      type: DataTypes.DATEONLY,
      defaultValue: moment().format("YYYY-MM-DD"),
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATEONLY,
      defaultValue: moment().format("YYYY-MM-DD"),
      allowNull: false,
    },
  },
  { timestamps: false }
);

Notice.belongsTo(User);
export default Notice;
