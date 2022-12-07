"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("student_class_teacher", {
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
      teacher_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: "teachers",
          },
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("student_class_teacher");
  },
};
