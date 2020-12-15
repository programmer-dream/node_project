'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('student_learning_library', {
          student_learning_library_vls_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          student_vls_id: {
            allowNull: false,
            type: Sequelize.INTEGER
          },
          learning_library_type: {
            type: Sequelize.ENUM('Video','Text')
          },
          subject: {
            type: Sequelize.STRING
          },
          topic: {
            type: Sequelize.DATE
          },
          time_spent: {
            type: Sequelize.STRING
          },
          Learning_library_vls_id: {
            type: Sequelize.INTEGER
          },
          last_visited_date: {
            type: Sequelize.STRING
          },
          created_at: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updated_at: {
            allowNull: false,
            type: Sequelize.DATE
          }
        },
        {
          engine: 'InnoDB',
          charset: 'utf8mb4',
        }
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('student_learning_library');
  }
};
