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
        allowNull: false,
        type: Sequelize.INTEGER
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
        type: Sequelize.BOOLEAN
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
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      } 
  },{
    tableName: 'branch_details',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
  );

  return BranchDetails;
};