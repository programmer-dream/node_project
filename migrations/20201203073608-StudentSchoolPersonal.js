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
      StudentSchoolVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      StudentVlsId: {
        allowNull: false,
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
      subject: {
        type: Sequelize.STRING
      },
      dob: {
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
        type: Sequelize.STRING
      },
      Address: {
        type: Sequelize.STRING
      },
      Hobbies: {
        type: Sequelize.STRING
      },
      ParentVlsId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      PassionVlsId: {
        allowNull: false,
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
