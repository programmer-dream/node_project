'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('privileges', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        role_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        operation_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        is_add: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        is_edit: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        is_view: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        is_delete: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        status: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
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
     await queryInterface.dropTable('privileges');
  }
};
