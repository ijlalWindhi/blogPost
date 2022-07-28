"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class post_category extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.post, {
                foreignKey: "category",
                as: "post",
            });
        }
    }
    post_category.init(
        {
            title: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "post_category",
            tableName: "post_category",
            timestamps: false,
        }
    );
    return post_category;
};
