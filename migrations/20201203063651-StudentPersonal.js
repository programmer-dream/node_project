'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('StudentPersonal', {
      StudentPersonalId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      StudentVlsId: {
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      middleName: {
        allowNull: true,
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.STRING
      },
      contact1: {
        allowNull: true,
        type: Sequelize.STRING
      },
      contact2: {
        allowNull: true,
        type: Sequelize.STRING
      },
      email_id: {
        allowNull: true,
        type: Sequelize.STRING
      },
      fatherName: {
        type: Sequelize.STRING
      },
      fatherQualification: {
        type: Sequelize.STRING
      },
      motherName: {
        type: Sequelize.STRING
      },
      motherQualification: {
        type: Sequelize.STRING
      },
      profilepic: {
        allowNull: true,
        type: Sequelize.STRING
      },
      Address: {
        allowNull: true,
        type: Sequelize.STRING
      },
      Hobbies: {
        allowNull: true,
        type: Sequelize.STRING
      },
      PassionVlsId: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
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
     await queryInterface.dropTable('StudentPersonal');
  }
};
