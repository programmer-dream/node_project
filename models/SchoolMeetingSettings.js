module.exports = (sequelize, Sequelize) => {
  const SchoolMeetingSettings = sequelize.define("school_meeting_settings", {
    meeting_setting_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      api_key: {
        type: Sequelize.STRING
      },
      api_secret: {
        type: Sequelize.STRING,
        allowNull: false
      },
      school_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      branch_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      video_service_id: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.INTEGER,
            defaultValue: 0
      },
      authenticationType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
  },{
    tableName: 'school_meeting_settings',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
  );

  return SchoolMeetingSettings;
};