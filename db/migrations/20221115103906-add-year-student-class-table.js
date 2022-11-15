"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn("student_classes", "year", {
      type: Sequelize.INTEGER,
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("student_classes", "year", {});
  },
};
