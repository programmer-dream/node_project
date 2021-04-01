'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('notification', 'is_deleted', {
                type: Sequelize.TINYINT(1),
                allowNull: false,
                defaultValue: 0
            });
    await queryInterface.sequelize.query(
    	"ALTER TABLE notification CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    );
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
