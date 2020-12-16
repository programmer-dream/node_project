'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('student_query', {
      query_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      branch_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      student_vls_id: {
        type: Sequelize.INTEGER
      },
      class_vls_id: {
        type: Sequelize.INTEGER
      },
      query_type: {
        type: Sequelize.STRING
      },
      query_date: {
        type: Sequelize.STRING
      },
      query_status: {
        type: Sequelize.ENUM('open','Inprogress','Closed','Rejected')
      },
      topic: {
        type: Sequelize.STRING
      },
      subject: {
        type: Sequelize.STRING
      },
      query_level: {
        type: Sequelize.ENUM('Basic', 'Intermediate','Expert')
      },
      headline: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      response: {
        type: Sequelize.STRING
      },
      response_date: {
        type: Sequelize.STRING
      },
      reply_vls_id: {
        type: Sequelize.INTEGER
      },
      rating: {
        type: Sequelize.STRING
      },
      likes: {
        type: Sequelize.STRING
      },
      tags: {
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('student_query');
  }
};
