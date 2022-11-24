"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("class_regitry_lesson", {
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
      lesson_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: "lessons",
          },
          key: "id",
        },
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("class_regitry_lesson");
  },
};
