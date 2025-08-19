import { Sequelize } from 'sequelize';
import dotenv from "dotenv"

dotenv.config();


const { DATABASE, USERNAME, PASSWORD } = process.env;

if (!DATABASE || !USERNAME || !PASSWORD) {
  throw new Error('Missing environment variables: DATABASE, USERNAME, or PASSWORD');
}


const sequelize = new Sequelize( DATABASE , USERNAME, PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
});

export default sequelize;
