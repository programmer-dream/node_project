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
      AssessmentVlsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BranchVlsId: {
        type: Sequelize.INTEGER
      },
      FirstSubjectTestMax: {
        type: Sequelize.STRING
      },
      FirstSubjectTestPassingCriteria: {
        type: Sequelize.STRING
      },
      FirstSubjectTestFirstClassCriteria: {
        type: Sequelize.STRING
      },
      FirstSubjectTestSecondClassCriteria: {
        type: Sequelize.STRING
      },
      FirstSubjectTestThirdClassCriteria: {
        type: Sequelize.STRING
      },
      OtherSubjectTestMax: {
        type: Sequelize.STRING
      },
      OtherSubjectTestPassingCriteria: {
        type: Sequelize.STRING
      },
      OtherSubjectTestFirstClassCriteria: {
        type: Sequelize.STRING
      },
      OtherSubjectTestSecondClassCriteria: {
        type: Sequelize.STRING
      },
      OtherSubjectTestThirdClassCriteria: {
        type: Sequelize.STRING
      },
      FirstSubjectAnnualMax: {
        type: Sequelize.STRING
      },
      FirstSubjectAnnualPassingCriteria: {
        type: Sequelize.STRING
      },
      FirstSubjectAnnualFirstClassCriteria: {
        type: Sequelize.STRING
      },
      FirstSubjectAnnualSecondClassCriteria: {
        type: Sequelize.STRING
      },
      FirstSubjectAnnualThirdClassCriteria: {
        type: Sequelize.STRING
      },
      OtherSubjectAnnualMax: {
        type: Sequelize.STRING
      },
      OtherSubjectAnnualPassingCriteria: {
        type: Sequelize.STRING
      },
      OtherSubjectAnnualFirstClassCriteria: {
        type: Sequelize.STRING
      },
      OtherSubjectAnnualSecondClassCriteria: {
        type: Sequelize.STRING
      },
      OtherSubjectAnnualThirdClassCriteria: {
        type: Sequelize.STRING
      },
      SportPassingCriteria: {
        type: Sequelize.STRING
      },
      SportsFirstClassCriteria: {
        type: Sequelize.STRING
      },
      SportSecondClassCriteria: {
        type: Sequelize.STRING
      },
      SportThirdClassCriteria: {
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
