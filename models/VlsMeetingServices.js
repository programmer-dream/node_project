module.exports = (sequelize, Sequelize) => {
  const VlsMeetingServices = sequelize.define("vls_meeting_services", {
    meeting_service_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      video_service_id: {
        type: Sequelize.INTEGER
      },
      api_key: {
        type: Sequelize.STRING
      },
      api_secret: {
        type: Sequelize.STRING,
        allowNull: false
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
    tableName: 'vls_meeting_services',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
  );

  return VlsMeetingServices;
};