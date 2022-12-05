"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("class_registry_student", {
      class_registry_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: "class_registries",
          },
          key: "id",
        },
        allowNull: false,
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
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("class_registry_student");
  },
};
