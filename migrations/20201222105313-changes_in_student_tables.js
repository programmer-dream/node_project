'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // return Promise.all([
            await queryInterface.removeColumn('students', 'student_vls_id');
            await queryInterface.renameColumn('students', 'student_id', 'student_vls_id');
            await queryInterface.renameColumn('student_vls', 'student_vls_id', 'student_id');
            await queryInterface.addColumn('student_vls', 'student_vls_id', {
                type: Sequelize.BIGINT,
                allowNull: false
            });
        // ])
  },
  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};