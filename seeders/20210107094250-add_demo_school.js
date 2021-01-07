'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('school', null, {});
     await queryInterface.sequelize.query("INSERT INTO `school` (`school_id`, `school_vls_id`, `school_name`, `website_url`, `description`, `address`, `phone`, `contact2`, `contact3`, `email`, `emailId2`, `notes`, `ratings`, `feedback_support`, `learning_library_support`, `video_library_support`, `assignment_support`, `chat_support`, `community_chat_support`, `rewards_and_recognition_support`, `notification_support`, `alert_support`, `mailbox_support`, `ERP_support`, `authentication_type`, `school_secret_token_key`, `created_at`, `updated_at`, `learning_library_support_type`) VALUES(1, 1, 'school one', NULL, 'This is testing school', 'adress', 'phone no', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-12-24 00:00:00', '2020-12-24 00:00:00', NULL)")
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('school', null, {});
  }
};
