module.exports = (sequelize, Sequelize) => {
  const UserSetting = sequelize.define("user_settings", {
    user_settings_vls_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      feedback_support: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      learning_library_support: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      video_library_support: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      assignment_support: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      chat_support: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      community_chat_support: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      rewards_and_recognition_support: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      notification_support: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      alert_support: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      mailbox_support: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      ERP_support: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      attendance_subject_wise: {
        allowNull: true,
        type: Sequelize.ENUM('yes', 'no')
      },
      student_report: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      learning_library_permission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      video_library_permission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      assignment_permission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      chat_permission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      community_chat_permission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      rewards_and_recognition_permission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      notification_permission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      alert_permission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      mailbox_permission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
      },
      ERP_permission: {
        allowNull: true,
        type: Sequelize.ENUM('Readonly', 'ReadWrite')
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
    tableName: 'user_settings',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
  );

  return UserSetting;
};