module.exports = (sequelize, Sequelize) => {
  const SchoolMeetingSettings = sequelize.define("school_meeting_settings", {
    meeting_setting_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      video_service_id: {
        type: Sequelize.INTEGER,
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