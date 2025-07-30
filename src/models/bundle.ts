// models/bundle.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Bundle extends Model {}

Bundle.init(
  {
    titre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    prixTotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    experiences: {
      type: DataTypes.JSONB, // tableau d'ID d’expériences
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Bundle',
    tableName: 'bundles',
    timestamps: true,
  }
);

export default Bundle;
