import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class City extends Model {}

City.init(
  {
    cityid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'City',
        key: 'cityid',
      },
    },
    countryid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cityname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    citycode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    countryname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cityiddotcom: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "City",
    tableName: "cities",
    timestamps: false,
  }
);

export default City;
