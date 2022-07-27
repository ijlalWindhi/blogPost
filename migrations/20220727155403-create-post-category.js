"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("post_category", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("post_category");
    },
};
