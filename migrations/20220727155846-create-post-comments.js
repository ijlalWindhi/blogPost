"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("post_comment", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            id_post: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "post",
                    key: "id",
                },
            },
            id_user: {
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
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            publishedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("post_comment");
    },
};
