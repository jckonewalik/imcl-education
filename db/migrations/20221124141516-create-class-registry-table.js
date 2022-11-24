"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("class_registries", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      student_class_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: "student_classes",
          },
          key: "id",
        },
        allowNull: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      teacher_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: "teachers",
          },
          key: "id",
        },
        allowNull: false,
      },
      creation_date: {
        type: Sequelize.DATE,
      },
      updated_on: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("class_registries");
  },
};
