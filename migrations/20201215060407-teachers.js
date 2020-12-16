'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('teachers', {
        teacher_id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        Branch_vls_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        contact2: {
          allowNull: false,
          type: Sequelize.STRING
        },
        qualification1: {
          allowNull: false,
          type: Sequelize.STRING
        },
        Degree1: {
          allowNull: false,
          type: Sequelize.STRING
        },
        University1: {
          allowNull: false,
          type: Sequelize.STRING
        },
        Year1: {
          allowNull: false,
          type: Sequelize.STRING
        },
        Degree2: {
          allowNull: false,
          type: Sequelize.STRING
        },
        University2: {
          allowNull: false,
          type: Sequelize.STRING
        },
        Year2: {
          allowNull: false,
          type: Sequelize.STRING
        },
        Degree3  : {
          allowNull: false,
          type: Sequelize.STRING
        },
        University3  : {
          allowNull: false,
          type: Sequelize.STRING
        },
        Year3  : {
          allowNull: false,
          type: Sequelize.STRING
        },
        father_name  : {
          allowNull: false,
          type: Sequelize.STRING
        },
        father_qualification  : {
          allowNull: false,
          type: Sequelize.STRING
        },
        mother_name  : {
          allowNull: false,
          type: Sequelize.STRING
        },
        mother_qualification : {
          allowNull: false,
          type: Sequelize.STRING
        },
        Emergency_contact  : {
          allowNull: false,
          type: Sequelize.STRING
        },
        Hobbies  : {
          allowNull: false,
          type: Sequelize.STRING
        },
        access_permission: {
          type: Sequelize.STRING
        },
        subject1: {
          type: Sequelize.STRING
        },
        subject2: {
          type: Sequelize.STRING
        },
        subject3: {
          type: Sequelize.STRING
        },
        subject4: {
          type: Sequelize.STRING
        },
        subject5: {
          type: Sequelize.STRING
        },
        spare1: {
          type: Sequelize.STRING
        },
        spare2: {
          type: Sequelize.STRING
        },
        spare3: {
          type: Sequelize.STRING
        },
        spare4: {
          type: Sequelize.STRING
        },
        spare5: {
          type: Sequelize.STRING
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        modified_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
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
     await queryInterface.dropTable('teachers');
  }
};
