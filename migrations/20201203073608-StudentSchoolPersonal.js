'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('students', {
      student_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      student_vls_id: {
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      subject: {
        type: Sequelize.STRING
      },
      dob: {
        allowNull: false,
        type: Sequelize.DATE
      },
      gender: {
        allowNull: false,
        type: Sequelize.STRING
      },
      phone: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contact2: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      father_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      father_qualification: {
        type: Sequelize.STRING
      },
      mother_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      mother_qualification: {
        type: Sequelize.STRING
      },
      photo: {
        type: Sequelize.STRING
      },
      present_address: {
        allowNull: false,
        type: Sequelize.STRING
      },
      hobbies: {
        type: Sequelize.STRING
      },
      parent_vls_id: {
        type: Sequelize.INTEGER
      },
      passion_vls_id: {
        type: Sequelize.INTEGER
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
     await queryInterface.dropTable('students');
  }
};
