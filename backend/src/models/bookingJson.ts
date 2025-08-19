import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const BookingJson = sequelize.define("bookingJson", {
  data: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
}, {
  freezeTableName: true, // ⬅ Prevents Sequelize from pluralizing
});

export default BookingJson;
