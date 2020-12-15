'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('roles', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        slug: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        note: {
          type: Sequelize.STRING
        },
        is_default: {
          type: Sequelize.BOOLEAN,
          defaultValue: 1
        },
        is_super_admin: {
          type: Sequelize.BOOLEAN,
          defaultValue: 0
        },
        status: {
          type: Sequelize.BOOLEAN,
          defaultValue: 1
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
     await queryInterface.dropTable('roles');
  }
};
