import { DataTypes } from "sequelize";
import sequelize from "./index.js";

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
  },
  { timestamps: false }
);

export default User;
