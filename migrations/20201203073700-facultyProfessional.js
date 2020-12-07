'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('facultyProfessional', {
      facultyProfessionalId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      facultyVlsId: {
        type: Sequelize.INTEGER
      },
      BranchVlsId: {
        type: Sequelize.INTEGER
      },
      designation: {
        type: Sequelize.STRING
      },
      dateOfJoining: {
        type: Sequelize.STRING
      },
      teacherType: {
        type: Sequelize.STRING
      },
      accessPermission: {
        type: Sequelize.STRING
      },
      isPrincipal: {
        type: Sequelize.BOOLEAN
      },
      isAdmin: {
        type: Sequelize.BOOLEAN
      },
      isTeacher: {
        type: Sequelize.BOOLEAN
      },
      isOfficeStaff: {
        type: Sequelize.BOOLEAN
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
      classVlsId1: {
        type: Sequelize.INTEGER
      },
      classVlsId2: {
        type: Sequelize.INTEGER
      },
      classVlsId3: {
        type: Sequelize.INTEGER
      },
      classVlsId4: {
        type: Sequelize.INTEGER
      },
      classVlsId5: {
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
     await queryInterface.dropTable('facultyProfessional');
  }
};
