'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('assignment', 'assignment_completion_date', {
                      type: Sequelize.DATE,
                        allowNull: false
                  });
    await queryInterface.changeColumn('assignment', 'assignment_type', {
                      type: Sequelize.ENUM('online','offline'),
                        allowNull: false
                  });
    await queryInterface.changeColumn('assignment', 'root_assignment_question_id', {
                      type: Sequelize.INTEGER,
                        allowNull: false
                  });
    await queryInterface.changeColumn('assignment', 'assignment_class_id', {
                      type: Sequelize.INTEGER,
                        allowNull: false
                  });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
