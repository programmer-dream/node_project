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
      branchVlsId: {
        type: Sequelize.INTEGER
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      middleName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      dob: {
        allowNull: false,
        type: Sequelize.STRING
      },
      sex: {
        type: Sequelize.STRING
      },
      contact1: {
        allowNull: false,
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
      degree1: {
        type: Sequelize.STRING
      },
      university1: {
        type: Sequelize.STRING
      },
      year1: {
        type: Sequelize.STRING
      },
      degree2: {
        type: Sequelize.STRING
      },
      university2: {
        type: Sequelize.STRING
      },
      year2: {
        type: Sequelize.STRING
      },
      degree3: {
        type: Sequelize.STRING
      },
      university3: {
        type: Sequelize.STRING
      },
      year3: {
        type: Sequelize.STRING
      },
      fatherName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      fatherQualification: {
        type: Sequelize.STRING
      },
      motherName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      motherQualification: {
        type: Sequelize.STRING
      },
      emergencyContact: {
        type: Sequelize.STRING
      },
      profilepic: {
        type: Sequelize.STRING
      },
      motherQualification: {
        type: Sequelize.STRING
      },
      hobbies: {
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
