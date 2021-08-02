module.exports = (sequelize, Sequelize) => {
  const VlsMeetings = sequelize.define("vls_meetings", {
    meeting_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      meeting_date: {
        type: Sequelize.DATE
      },
      meeting_start : {
        type: Sequelize.STRING
      },
      meeting_end :{
        type: Sequelize.STRING
      },
      meeting_end :{
        type: Sequelize.STRING
      },
      presenter :{
        type: Sequelize.STRING
      },
      attendanceList :{
        type: Sequelize.TEXT('long')
      },
      owner :{
        type: Sequelize.STRING
      },
      school_vls_id :{
        type: Sequelize.INTEGER,
        allowNull:false
      },
      branch_vls_id :{
        type: Sequelize.INTEGER,
        allowNull:false
      },
      meeting_type :{
        type: Sequelize.ENUM('online_meeting', 'live_classes'),
        defaultValue: 'live_classes',
        allowNull:false
      },
      status :{
        type: Sequelize.ENUM('Upcoming', 'Inprogres','Closed','Deleted')
      },
      service_meeting_id :{
        type: Sequelize.STRING,
        allowNull:false
      },
      meeting_passcode :{
        type: Sequelize.STRING,
        allowNull:false
      },
      meeting_url :{
        type: Sequelize.STRING,
        allowNull:false
      },
      meeting_dialin_url :{
        type: Sequelize.STRING
      },
      meeting_settings :{
        type: Sequelize.STRING
      },
      notes :{
        type: Sequelize.TEXT
      },
      academic_year_id :{
        type: Sequelize.INTEGER
      },
      class_date :{
        type: Sequelize.DATE
      },
      class_id :{
        type: Sequelize.INTEGER
      },
      section_id :{
        type: Sequelize.INTEGER
      },
      subject_code :{
        type: Sequelize.STRING
      },
      teacher_id :{
        type: Sequelize.INTEGER
      },
      send_notification :{
        type: Sequelize.INTEGER
      },
      created_at :{
        type: Sequelize.DATE
      },
      updated_at :{
        type: Sequelize.DATE
      },
      created_by :{
        type: Sequelize.STRING,
        allowNull:false
      },
      api_video_service_id :{
        type: Sequelize.BIGINT,
        allowNull:false
      },
      is_deleted :{
        type: Sequelize.TINYINT(1),
        defaultValue:0
      },
      resource_meeting_id :{
        type: Sequelize.STRING,
      }
  },{
      tableName: 'vls_meetings',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  
  return VlsMeetings;
};