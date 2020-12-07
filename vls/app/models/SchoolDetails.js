module.exports = (sequelize, Sequelize) => {
  const SchoolDetails = sequelize.define("SchoolDetails", {
    SchoolVlsId: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
      Name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      WebsiteURL: {
        type: Sequelize.STRING
      },
      Description: {
        allowNull: false,
        type: Sequelize.STRING
      },
      Address: {
        allowNull: false,
        type: Sequelize.STRING
      },
      Contact1: {
        allowNull: false,
        type: Sequelize.STRING
      },
      Contact2: {
        type: Sequelize.STRING
      },
      Contact3: {
        type: Sequelize.STRING
      },
      EmailId1: {
        allowNull: false,
        type: Sequelize.STRING
      },
      EmailId2: {
        type: Sequelize.STRING
      },
      Notes: {
        type: Sequelize.STRING
      },
      Ratings: {
        type: Sequelize.STRING
      },
      FeedbackSupport: {
        type: Sequelize.STRING
      },
      LearningLibrarySuport: {
        type: Sequelize.ENUM('SMS', 'Email', 'Both')
      },
      videoLibrarySupport: {
        type: Sequelize.BOOLEAN
      },
      AssignmentSupport: {
        type: Sequelize.BOOLEAN
      },
      chatSupport: {
        type: Sequelize.BOOLEAN
      },
      CommunityChatSupport: {
        type: Sequelize.BOOLEAN
      },
      RewardsAndRecognitionSupport: {
        type: Sequelize.BOOLEAN
      },
      NotificationSupport: {
        type: Sequelize.BOOLEAN
      },
      AlertSupport: {
        type: Sequelize.BOOLEAN
      },
      MailboxSupport: {
        type: Sequelize.BOOLEAN
      },
      ERPSupport: {
        type: Sequelize.BOOLEAN
      },
      AuthenticationType: {
        type: Sequelize.ENUM('OTP', 'thirdparty','captcha','checkbox')
      },
      SchoolSecretTokenKey: {
        type: Sequelize.STRING
      }
  },{
    tableName: 'SchoolDetails'
  }
  );

  return SchoolDetails;
};