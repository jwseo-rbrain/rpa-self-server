import { DataTypes } from "sequelize";
import sequelize from "./index.js";
import moment from "moment";

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },
    userPw: {
      type: DataTypes.STRING(125),
      allowNull: false,
    },
    userNm: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    userEmail: {
      type: DataTypes.STRING(125),
      allowNull: false,
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

export default User;
