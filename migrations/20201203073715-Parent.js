'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('guardians', {
      parent_vls_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.DATE
      },
      phone: {
        type: Sequelize.STRING
      },
      contact2: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      qualification1: {
        type: Sequelize.STRING
      },
      photo: {
        type: Sequelize.STRING
      },
      present_address: {
        type: Sequelize.STRING
      },
      hobbies: {
        type: Sequelize.STRING
      },
      emergency_contact: {
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
     await queryInterface.dropTable('guardians');
  }
};
