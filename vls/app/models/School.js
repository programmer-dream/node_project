module.exports = (sequelize, Sequelize) => {
  const School = sequelize.define("school", {
    school_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      school_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
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
      learning_library_suport: {
        type: Sequelize.ENUM('SMS', 'Email', 'Both')
      },
      video_library_support: {
        type: Sequelize.BOOLEAN
      },
      assignment_support: {
        type: Sequelize.BOOLEAN
      },
      chat_support: {
        type: Sequelize.BOOLEAN
      },
      community_chat_support: {
        type: Sequelize.BOOLEAN
      },
      rewards_and_recognition_support: {
        type: Sequelize.BOOLEAN
      },
      notification_support: {
        type: Sequelize.BOOLEAN
      },
      alert_support: {
        type: Sequelize.BOOLEAN
      },
      mailbox_support: {
        type: Sequelize.BOOLEAN
      },
      ERP_support: {
        type: Sequelize.BOOLEAN
      },
      authentication_type: {
        type: Sequelize.ENUM('OTP', 'thirdparty','captcha','checkbox')
      },
      school_secret_token_key: {
        type: Sequelize.STRING
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
    tableName: 'school'
  }
  );

  return School;
};