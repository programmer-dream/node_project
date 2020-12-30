'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('learning_library', 'cover_photo', {
                type: Sequelize.STRING
            });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('learning_library', 'cover_photo');
  }
};
