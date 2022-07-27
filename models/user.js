"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.post, {
                foreignKey: "author",
                as: "post",
            });
        }
    }
    user.init(
        {
            name: DataTypes.STRING,
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            profile: DataTypes.STRING,
            location: DataTypes.STRING,
            status: DataTypes.STRING,
            website: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "user",
            tableName: "user",
            timestamps: false,
        }
    );
    return user;
};
