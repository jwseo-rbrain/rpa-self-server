import { Sequelize } from "sequelize";
import { config } from "dotenv";
config();
const { DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_HOST } = process.env;
const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
  timezone: "+09:00",
});

export default sequelize;
