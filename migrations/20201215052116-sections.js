'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('sections', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        section_vls_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        Branch_vls_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        school_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        class_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        teacher_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING(50)
        },
        note: {
          allowNull: false,
          type: Sequelize.STRING
        },
        status: {
          allowNull: false,
          type: Sequelize.BOOLEAN
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        modified_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        created_by: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        modified_by: {
          allowNull: false,
          type: Sequelize.INTEGER
        }
      },
      {
          engine: 'InnoDB',
          charset: 'utf8mb4',
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('sections');
  }
};
