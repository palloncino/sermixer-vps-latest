import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import { toNumber } from '../utils/numberUtils.js';

class Document extends Model {}

Document.init(
  {
    clientEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    dateOfSignature: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    revisions: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    pdfUrls: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    readonly: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        CLIENT_VIEWED_DOC: false,
        YOUR_TURN: false,
        FINALIZED: false,
        REJECTED: false
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    employeeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
      get() {
        const rawValue = this.getDataValue('discount');
        return toNumber(rawValue);
      }
    },
  },
  {
    sequelize,
    modelName: "Document",
    tableName: "documents",
    timestamps: true,
  }
);

export default Document;
