import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Définir les attributs
interface FavoriteAttributes {
  id?: number;
  userId: number;
  experienceId: number;
}

// Pour rendre certains champs optionnels à l'init
interface FavoriteCreationAttributes extends Optional<FavoriteAttributes, 'id'> {}

// Étendre Model avec les attributs
class Favorite extends Model<FavoriteAttributes, FavoriteCreationAttributes>
  implements FavoriteAttributes {
  public id!: number;
  public userId!: number;
  public experienceId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Favorite.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    experienceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Favorite',
    tableName: 'favorites',
    timestamps: true,
  }
);

export default Favorite;
