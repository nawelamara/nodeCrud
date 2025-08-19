import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { Json } from 'sequelize/types/utils';

class User extends Model {
  public id!: number;
  public data!: Json;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false,
    },

  },
  {
    sequelize,
    tableName: 'userJson',
  }
);

export default User;
