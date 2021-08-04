module.exports = (sequelize, Sequelize) => {
  const School = sequelize.define("school", {
    school_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      school_vls_id: {
        type: Sequelize.INTEGER,
        defaultValue : 0
      },
      school_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      website_url: {
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING
      },
      phone: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contact2: {
        type: Sequelize.STRING
      },
      contact3: {
        type: Sequelize.STRING
      },
      email: {
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
      feedback_support: {
        type: Sequelize.STRING
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
      authentication_type: {
        type: Sequelize.ENUM('OTP', 'thirdparty','captcha','checkbox')
      },
      school_secret_token_key: {
        type: Sequelize.STRING
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
      logo: {
        type: Sequelize.STRING
      },
      video_service_enabled: {
        type: Sequelize.ENUM('yes','no'),
        defaultValue: 'no'
      },
      is_vls_online_video_service_enabled: {
        type: Sequelize.ENUM('yes','no'),
        defaultValue: 'no'
      },
      max_simultaneous_online_meeting_supported: {
        type: Sequelize.INTEGER
      },
      video_services_enabled: {
        type: Sequelize.STRING
      },
      school_code: {
        type: Sequelize.STRING,
        allowNull: false
      }
  },{
    tableName: 'school',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
  );

  return School;
};