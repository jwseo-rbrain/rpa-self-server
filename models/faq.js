import { DataTypes } from "sequelize";
import moment from "moment";
import User from "./auth.js";
import sequelize from "./index.js";

const Faq = sequelize.define(
  "faq",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
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

Faq.belongsTo(User);

export default Faq;
