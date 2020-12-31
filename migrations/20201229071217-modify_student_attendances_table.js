'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
           queryInterface.addColumn('student_attendances', 'academic_year_id', {
                      type: Sequelize.INTEGER,
                      allowNull: false
                  }),
           queryInterface.addColumn('student_attendances', 'class_id', {
                      type: Sequelize.INTEGER,
                      allowNull: false
                  }),
           queryInterface.addColumn('student_attendances', 'section_id', {
                      type: Sequelize.INTEGER,
                      allowNull: false
                  }),
           queryInterface.addColumn('student_attendances', 'month', {
                      type: Sequelize.STRING(10),
                      allowNull: false
                  }),
           queryInterface.addColumn('student_attendances', 'year', {
                      type: Sequelize.STRING(10),
                      allowNull: false
                  }),
            queryInterface.addColumn('student_attendances', 'day_1', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_2', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_3', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_4', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_5', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_6', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_7', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_8', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_9', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_10', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_11', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_12', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_13', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_14', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_15', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_16', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_17', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_18', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_19', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_20', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_21', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_22', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_23', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_24', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_25', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_26', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_27', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_28', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_29', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_30', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'day_31', {
                      type: Sequelize.STRING(1)
                  }),
            queryInterface.addColumn('student_attendances', 'created_by', {
                      type: Sequelize.INTEGER
                  }),
            queryInterface.addColumn('student_attendances', 'modified_by', {
                      type: Sequelize.INTEGER
                  })
            
     ])
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
