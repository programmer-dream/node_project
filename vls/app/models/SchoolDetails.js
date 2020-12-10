module.exports = (sequelize, Sequelize) => {
  const SchoolDetails = sequelize.define("SchoolDetails", {
    schoolVlsId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      websiteURL: {
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
      feedbackSupport: {
        type: Sequelize.STRING
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
      },
      authenticationType: {
        type: Sequelize.ENUM('OTP', 'thirdparty','captcha','checkbox')
      },
      schoolSecretTokenKey: {
        type: Sequelize.STRING
      }
  },{
    tableName: 'SchoolDetails'
  }
  );

  return SchoolDetails;
};