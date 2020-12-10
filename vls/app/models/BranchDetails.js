module.exports = (sequelize, Sequelize) => {
  const BranchDetails = sequelize.define("BranchDetails", {
    branchVlsId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
      schoolId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      branchName: {
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
      assessmentSystem: {
        type: Sequelize.STRING
      },
      assessmentScheme: {
        type: Sequelize.STRING
      },
      assessmentVlsId: {
        type: Sequelize.STRING
      },
      noOfWorkingDays: {
        type: Sequelize.STRING
      },
      feedbackSupport: {
        type: Sequelize.BOOLEAN
      },
      learningLibrarySuport: {
        type: Sequelize.ENUM('SMS', 'Email', 'Both')
      },
      videoLibrarySupport: {
        type: Sequelize.BOOLEAN
      },
      assignmentSupport: {
        type: Sequelize.BOOLEAN
      },
      chatSupport: {
        type: Sequelize.BOOLEAN
      },
      communityChatSupport: {
        type: Sequelize.BOOLEAN
      },
      rewardsAndRecognitionSupport: {
        type: Sequelize.BOOLEAN
      },
      notificationSupport: {
        type: Sequelize.BOOLEAN
      },
      alertSupport: {
        type: Sequelize.BOOLEAN
      },
      mailboxSupport: {
        type: Sequelize.BOOLEAN
      },
      ERPSupport: {
        type: Sequelize.BOOLEAN
      }
  },{
    tableName: 'BranchDetails'
  }
  );

  return BranchDetails;
};