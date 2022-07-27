"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("post", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            poster: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            author: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "user",
                    key: "id",
                },
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            category: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "post_category",
                    key: "id",
                },
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("post");
    },
};
