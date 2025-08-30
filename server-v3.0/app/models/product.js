import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import Logger from "../utils/Logger.js"; // Import Logger to use it within the model
import { toNumber } from '../utils/numberUtils.js'; // Import toNumber function
import { v4 as uuidv4 } from "uuid";

class Product extends Model { }

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      get() {
        const rawValue = this.getDataValue('price');
        return toNumber(rawValue);
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imgUrl: {
      type: DataTypes.STRING, // Change to standard string for URL
      allowNull: true,
    },
    components: {
      type: DataTypes.JSON,
      get() {
        const rawValue = this.getDataValue('components');
        if (!Array.isArray(rawValue)) {
          if (typeof rawValue === 'string') {
            return JSON.parse(rawValue);
          }
        }
        return rawValue.map(component => ({
          id: component.id,
          name: component.name || '',
          description: component.description || '',
          price: toNumber(component.price) || 0,
          quantity: component.quantity || 1, // Default quantity
          included: component.included || false,
          imgUrl: component.imgUrl || "",
          discount: toNumber(component.discount) || 0 // Ensure discount is parsed
        }));
      },
      set(value) {
        Logger.debug("Setting components:", { value });
        if (!Array.isArray(value)) {
          throw new Error("Components must be an array");
        }
        this.setDataValue('components', value.map(component => ({
          id: uuidv4(),
          name: component.name || '',
          description: component.description || '',
          price: toNumber(component.price) || 0,
          quantity: component.quantity || 1, // Default quantity
          included: component.included || false,
          imgUrl: component.imgUrl || "",
          discount: toNumber(component.discount) || 0 // Ensure discount is parsed
        })));
      }
    },
    discount: {
      type: DataTypes.FLOAT, // percentage of discount on product
      allowNull: true,
      defaultValue: 0.0,
      get() {
        const rawValue = this.getDataValue('discount');
        return toNumber(rawValue);
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: true,
    hooks: {
      beforeCreate: (product, options) => {
        Logger.debug(`Before Create Hook: ${JSON.stringify(product)}`);
      },
      beforeUpdate: (product, options) => {
        Logger.debug(`Before Update Hook: ${JSON.stringify(product)}`);
      },
    },
  }
);

export default Product;
