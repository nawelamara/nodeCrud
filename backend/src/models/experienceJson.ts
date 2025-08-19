import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import City from "./city";

const ExperienceJson = sequelize.define("experienceJson", {
  
  data: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  cityid: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: City,
      key: 'cityid',
    },
  },
  countryid: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
},
 {
  timestamps: true,
}
);

 //Relations
ExperienceJson.belongsTo(City, { foreignKey: 'cityid', as: 'ville' });
City.hasMany(ExperienceJson, { foreignKey: 'cityid' });
export default ExperienceJson;
