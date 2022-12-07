"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("class_registry_lesson", {
      class_registry_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: "class_registries",
          },
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
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
    return queryInterface.dropTable("class_registry_lesson");
  },
};
