"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class post extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.user, {
                foreignKey: "author",
                as: "user",
            });
            this.belongsTo(models.post_category, {
                foreignKey: "category",
                as: "post_category",
            });
        }
    }
    post.init(
        {
            poster: DataTypes.STRING,
            author: DataTypes.INTEGER,
            title: DataTypes.STRING,
            description: DataTypes.STRING,
            category: DataTypes.INTEGER,
            content: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "post",
            tableName: "post",
            timestamps: false,
        }
    );
    return post;
};
