'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.createTable('StudentAcademic', {
      StudentAcademicId: {
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
      dateOfAdmission: {
        type: Sequelize.DATE
      },
      RegisterNumber: {
        type: Sequelize.STRING
      },
      classVlsId: {
        allowNull: false,
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
     await queryInterface.dropTable('StudentAcademic');
  }
};
