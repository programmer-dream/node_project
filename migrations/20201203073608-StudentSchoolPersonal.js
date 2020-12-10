'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('StudentSchoolPersonal', {
      studentSchoolVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      studentVlsId: {
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
      subject: {
        type: Sequelize.STRING
      },
      dob: {
        allowNull: false,
        type: Sequelize.DATE
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
      profilepic: {
        type: Sequelize.STRING
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING
      },
      hobbies: {
        type: Sequelize.STRING
      },
      parentVlsId: {
        type: Sequelize.INTEGER
      },
      passionVlsId: {
        type: Sequelize.INTEGER
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
     await queryInterface.dropTable('StudentSchoolPersonal');
  }
};
