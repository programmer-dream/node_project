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
        type: Sequelize.INTEGER
      },
      branch_vls_id :{
        type: Sequelize.INTEGER
      },
      meeting_type :{
        type: Sequelize.STRING
      },
      status :{
        type: Sequelize.ENUM('Upcoming', 'Inprogres','Closed','Deleted')
      },
      service_meeting_id :{
        type: Sequelize.STRING
      },
      meeting_passcode :{
        type: Sequelize.STRING
      },
      meeting_url :{
        type: Sequelize.STRING
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
      subject_id :{
        type: Sequelize.INTEGER
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
      }
  },{
      tableName: 'vls_meetings',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  
  return VlsMeetings;
};