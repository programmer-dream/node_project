'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
      await queryInterface.changeColumn('student_learning_library', 'topic', {
                      type: Sequelize.STRING,
                  });
      await queryInterface.changeColumn('student_learning_library', 'student_vls_id', {
                      type: Sequelize.BIGINT
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
