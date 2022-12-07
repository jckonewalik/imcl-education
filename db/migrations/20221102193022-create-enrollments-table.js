"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("enrollments", {
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
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      student_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: "students",
          },
          key: "id",
        },
        allowNull: false,
      },
      creation_date: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("enrollments");
  },
};
