'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

     await queryInterface.addColumn('school', 'attendance_subject_wise', {
                    allowNull: true,
                    type: Sequelize.ENUM('yes', 'no')
                });

     await queryInterface.addColumn('branch_details', 'attendance_subject_wise', {
                    allowNull: true,
                    type: Sequelize.ENUM('yes', 'no')
                });

     await queryInterface.addColumn('user_settings', 'attendance_subject_wise', {
                    allowNull: true,
                    type: Sequelize.ENUM('yes', 'no')
                });
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
