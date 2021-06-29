'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vls_meetings', {
      metting_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      metting_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      metting_start: {
        type: Sequelize.STRING,
        allowNull: false
      },
      metting_end: {
        type: Sequelize.STRING,
        allowNull: false
      },
      presenter: {
        type: Sequelize.STRING
      },
      attendanceList: {
        type: Sequelize.TEXT('long')
      },
      owner: {
        type: Sequelize.STRING
      },
      school_vls_id: {
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        type: Sequelize.INTEGER
      },
      meeting_type: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('Upcoming', 'Inprogres','Closed','Deleted')
      },
      service_meeting_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      meeting_passcode: {
        type: Sequelize.STRING
      },
      meeting_url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      meeting_dialin_url: {
        type: Sequelize.STRING
      },
      meeting_settings: {
        type: Sequelize.STRING
      },
      notes: {
        type: Sequelize.TEXT
      },
      academic_year_id: {
        type: Sequelize.INTEGER
      },
      class_date: {
        type: Sequelize.DATE
      },
      class_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      section_id: {
        type: Sequelize.INTEGER
      },
      subject_id: {
        type: Sequelize.INTEGER
      },
      teacher_id: {
        type: Sequelize.INTEGER
      },
      send_notification: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
