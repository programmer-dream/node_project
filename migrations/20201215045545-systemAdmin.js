'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('system_admin', {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          user_id: {
            type: Sequelize.INTEGER
          },
          is_default: {
            type: Sequelize.BOOLEAN,
            defaultValue: 0
          },
          national_id: {
            type: Sequelize.STRING(100)
          },
          name: {
            type: Sequelize.STRING(100)
          },
          email: {
            type: Sequelize.STRING(50)
          },
          phone: {
            type: Sequelize.STRING(20)
          },
          present_address: {
            type: Sequelize.STRING
          },
          permanent_address: {
            type: Sequelize.STRING
          },
          gender: {
            type: Sequelize.STRING(10)
          },
          blood_group: {
            type: Sequelize.STRING(15)
          },
          religion: {
            type: Sequelize.STRING(100)
          },
          dob: {
            type: Sequelize.DATE
          },
          photo: {
            type: Sequelize.STRING(100)
          },
          resume: {
            type: Sequelize.STRING(100)
          },
          other_info: {
            type: Sequelize.TEXT
          },
          status: {
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
     await queryInterface.dropTable('system_admin');
  }
};
