'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('AssessmentCriteria', {
      assessmentVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branchVlsId: {
        type: Sequelize.INTEGER
      },
      firstSubjectTestMax: {
        type: Sequelize.STRING
      },
      firstSubjectTestPassingCriteria: {
        type: Sequelize.STRING
      },
      firstSubjectTestFirstClassCriteria: {
        type: Sequelize.STRING
      },
      firstSubjectTestSecondClassCriteria: {
        type: Sequelize.STRING
      },
      firstSubjectTestThirdClassCriteria: {
        type: Sequelize.STRING
      },
      otherSubjectTestMax: {
        type: Sequelize.STRING
      },
      otherSubjectTestPassingCriteria: {
        type: Sequelize.STRING
      },
      otherSubjectTestFirstClassCriteria: {
        type: Sequelize.STRING
      },
      otherSubjectTestSecondClassCriteria: {
        type: Sequelize.STRING
      },
      otherSubjectTestThirdClassCriteria: {
        type: Sequelize.STRING
      },
      firstSubjectAnnualMax: {
        type: Sequelize.STRING
      },
      firstSubjectAnnualPassingCriteria: {
        type: Sequelize.STRING
      },
      firstSubjectAnnualFirstClassCriteria: {
        type: Sequelize.STRING
      },
      firstSubjectAnnualSecondClassCriteria: {
        type: Sequelize.STRING
      },
      firstSubjectAnnualThirdClassCriteria: {
        type: Sequelize.STRING
      },
      otherSubjectAnnualMax: {
        type: Sequelize.STRING
      },
      otherSubjectAnnualPassingCriteria: {
        type: Sequelize.STRING
      },
      otherSubjectAnnualFirstClassCriteria: {
        type: Sequelize.STRING
      },
      otherSubjectAnnualSecondClassCriteria: {
        type: Sequelize.STRING
      },
      otherSubjectAnnualThirdClassCriteria: {
        type: Sequelize.STRING
      },
      sportPassingCriteria: {
        type: Sequelize.STRING
      },
      sportsFirstClassCriteria: {
        type: Sequelize.STRING
      },
      sportSecondClassCriteria: {
        type: Sequelize.STRING
      },
      sportThirdClassCriteria: {
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
     await queryInterface.dropTable('AssessmentCriteria');
  }
};
