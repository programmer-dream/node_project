'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('languages', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        label: {
          type: Sequelize.STRING
        },
        english: {
          type: Sequelize.TEXT('long')
        },
        bengali: {
          type: Sequelize.TEXT('long')
        },
        spanish: {
          type: Sequelize.TEXT('long')
        },
        arabic: {
          type: Sequelize.TEXT('long')
        },
        hindi: {
          type: Sequelize.TEXT('long')
        },
        urdu: {
          type: Sequelize.TEXT('long')
        },
        chinese: {
          type: Sequelize.TEXT('long')
        },
        japanese: {
          type: Sequelize.TEXT('long')
        },
        portuguese: {
          type: Sequelize.TEXT('long')
        },
        russian: {
          type: Sequelize.TEXT('long')
        },
        french: {
          type: Sequelize.TEXT('long')
        },
        korean: {
          type: Sequelize.TEXT('long')
        },
        german: {
          type: Sequelize.TEXT('long')
        },
        italian: {
          type: Sequelize.TEXT('long')
        },
        thai: {
          type: Sequelize.TEXT('long')
        },
        hungarian: {
          type: Sequelize.TEXT('long')
        },
        dutch: {
          type: Sequelize.TEXT('long')
        },
        latin: {
          type: Sequelize.TEXT('long')
        },
        indonesian: {
          type: Sequelize.TEXT('long')
        },
        turkish: {
          type: Sequelize.TEXT('long')
        },
        greek: {
          type: Sequelize.TEXT('long')
        },
        persian: {
          type: Sequelize.TEXT('long')
        },
        malay: {
          type: Sequelize.TEXT('long')
        },
        telugu: {
          type: Sequelize.TEXT('long')
        },
        tamil: {
          type: Sequelize.TEXT('long')
        },
        gujarati: {
          type: Sequelize.TEXT('long')
        },
        polish: {
          type: Sequelize.TEXT('long')
        },
        ukrainian: {
          type: Sequelize.TEXT('long')
        },
        panjabi: {
          type: Sequelize.TEXT('long')
        },
        romanian: {
          type: Sequelize.TEXT('long')
        },
        burmese: {
          type: Sequelize.TEXT('long')
        },
        yoruba: {
          type: Sequelize.TEXT('long')
        },
        hausa: {
          type: Sequelize.TEXT('long')
        },
        mylang: {
          type: Sequelize.TEXT('long')
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
     await queryInterface.dropTable('languages');
  }
};
