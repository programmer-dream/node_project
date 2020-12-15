'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('operations', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        module_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        operation_name: {
          type: Sequelize.STRING(50),
          allowNull: false
        },
        operation_slug: {
          type: Sequelize.STRING(50),
          allowNull: false
        },
        is_view_vissible: {
          type: Sequelize.BOOLEAN,
          defaultValue: 0
        },
        is_add_vissible: {
          type: Sequelize.BOOLEAN,
          defaultValue: 0
        },
        is_edit_vissible: {
          type: Sequelize.BOOLEAN,
          defaultValue: 0
        },
        is_edit_vissible: {
          type: Sequelize.BOOLEAN,
          defaultValue: 0
        },
        is_delete_vissible: {
          type: Sequelize.BOOLEAN,
          defaultValue: 0
        },
        status: {
          type: Sequelize.BOOLEAN,
          allowNull: false
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
     await queryInterface.dropTable('operations');
  }
};
