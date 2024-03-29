module.exports = (sequelize, Sequelize) => {
  const BranchDetails = sequelize.define("branch_details", {
    branch_vls_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      school_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      school_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      school_vls_id: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      branch_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contact1: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contact2: {
        type: Sequelize.STRING
      },
      contact3: {
        type: Sequelize.STRING
      },
      emailId1: {
        allowNull: false,
        type: Sequelize.STRING
      },
      emailId2: {
        type: Sequelize.STRING
      },
      notes: {
        type: Sequelize.STRING
      },
      ratings: {
        type: Sequelize.STRING
      },
      subjects: {
        type: Sequelize.TEXT
      },
      assessment_system: {
        type: Sequelize.STRING
      },
      assessment_scheme: {
        type: Sequelize.STRING
      },
      assessment_vls_id: {
        type: Sequelize.STRING
      },
      no_of_working_days: {
        type: Sequelize.STRING
      },
      feedback_support: {
        type: Sequelize.ENUM('yes','no')
      },
      learning_library_support: {
        type: Sequelize.ENUM('yes','no')
      },
      video_library_support: {
        type: Sequelize.ENUM('yes','no')
      },
      assignment_support: {
        type: Sequelize.ENUM('yes','no')
      },
      chat_support: {
        type: Sequelize.ENUM('yes','no')
      },
      community_chat_support: {
        type: Sequelize.ENUM('yes','no')
      },
      rewards_and_recognition_support: {
        type: Sequelize.ENUM('yes','no')
      },
      notification_support: {
        type: Sequelize.ENUM('yes','no')
      },
      alert_support: {
        type: Sequelize.ENUM('yes','no')
      },
      mailbox_support: {
        type: Sequelize.ENUM('yes','no')
      },
      ERP_support: {
        type: Sequelize.ENUM('yes','no')
      },
      attendance_subject_wise: {
        type: Sequelize.ENUM('yes','no')
      },
      learning_library_support_type: {
        type: Sequelize.ENUM('SMS', 'Email', 'Both')
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      is_deleted: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      passion_support: {
        type: Sequelize.ENUM('yes','no'),
        defaultValue: 'no'
      },
      is_video_meeting_enabled :{
        type: Sequelize.ENUM('yes','no'),
        defaultValue: 'no'
      },
      vendor_id :{
        type: Sequelize.STRING
      },
      vendor_percentage :{
        type: Sequelize.STRING
      },
      vendor_details :{
        type: Sequelize.STRING
      },
      payment_service: {
        type: Sequelize.ENUM('no','yes'),
        defaultValue: 'no'
      },
      video_service_enabled: {
        type: Sequelize.ENUM('no','yes'),
        defaultValue: 'no'
      },
  },{
    tableName: 'branch_details',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
  );

  return BranchDetails;
};