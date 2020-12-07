'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('facultyPersonal', {
      facultyVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BranchVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      middleName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.STRING
      },
      sex: {
        type: Sequelize.STRING
      },
      contact1: {
        type: Sequelize.STRING
      },
      contact2: {
        type: Sequelize.STRING
      },
      emailId: {
        type: Sequelize.STRING
      },
      qualification1: {
        type: Sequelize.STRING
      },
      Degree1: {
        type: Sequelize.STRING
      },
      University1: {
        type: Sequelize.STRING
      },
      Year1: {
        type: Sequelize.STRING
      },
      Degree2: {
        type: Sequelize.STRING
      },
      University2: {
        type: Sequelize.STRING
      },
      Year2: {
        type: Sequelize.STRING
      },
      Degree3: {
        type: Sequelize.STRING
      },
      University3: {
        type: Sequelize.STRING
      },
      Year3: {
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
      EmergencyContact: {
        type: Sequelize.STRING
      },
      profilepic: {
        type: Sequelize.STRING
      },
      motherQualification: {
        type: Sequelize.STRING
      },
      Hobbies: {
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
     await queryInterface.dropTable('facultyPersonal');
  }
};
