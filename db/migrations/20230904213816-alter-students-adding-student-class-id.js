'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('students', 'student_class_id', { type: Sequelize.UUID });
    await queryInterface.addConstraint('students', {
      fields: ['student_class_id'],
      type: 'foreign key',
      name: 'student_student_class',
      references: {
        table: 'student_classes',
        field: 'id'
      }
    });
    await queryInterface.sequelize.query("update students set student_class_id = e.student_class_id from enrollments e where e.student_id = students.id")
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('students', 'student_student_class', {});
    await queryInterface.removeColumn('students', 'student_class_id', {});
  }
};
