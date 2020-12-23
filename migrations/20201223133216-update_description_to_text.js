'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      return Promise.all([
           queryInterface.changeColumn('passion_and_interests', 'description', {
                      type: Sequelize.TEXT,
                      allowNull: false
                  }),
           queryInterface.changeColumn('video_learning_library', 'description', {
                      type: Sequelize.TEXT,
                      allowNull: false
                  }),
          queryInterface.changeColumn('school', 'description', {
                      type: Sequelize.TEXT,
                      allowNull: false
                  }),
          queryInterface.changeColumn('learning_library', 'description', {
                      type: Sequelize.TEXT,
                      allowNull: false
                  }),
          queryInterface.changeColumn('assignment_questions', 'description', {
                      type: Sequelize.TEXT,
                      allowNull: false
                  }),
          queryInterface.changeColumn('rewards', 'description', {
                      type: Sequelize.TEXT,
                      allowNull: false
                  }),
          queryInterface.changeColumn('recognition', 'description', {
                      type: Sequelize.TEXT,
                      allowNull: false
                  }),
          queryInterface.changeColumn('student_query', 'description', {
                      type: Sequelize.TEXT,
                      allowNull: false
                  })
           
     ])
  },

  down: async (queryInterface, Sequelize) => {

  }
};
