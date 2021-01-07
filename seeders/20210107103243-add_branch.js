'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('branch_details', null, {});
     await queryInterface.sequelize.query("INSERT INTO `branch_details` (`branch_vls_id`, `school_vls_id`, `school_id`, `branch_name`, `address`, `contact1`, `contact2`, `contact3`, `emailId1`, `emailId2`, `notes`, `ratings`, `assessment_system`, `assessment_scheme`, `assessment_vls_id`, `no_of_working_days`, `feedback_support`, `learning_library_support`, `video_library_support`, `assignment_support`, `chat_support`, `community_chat_support`, `rewards_and_recognition_support`, `notification_support`, `alert_support`, `mailbox_support`, `ERP_support`, `created_at`, `updated_at`, `subjects`, `learning_library_support_type`) VALUES(1, 1, 1, 'first branch', 'test adress', '123456789', NULL, NULL, 'test@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-12-23 00:00:00', '2020-12-23 00:00:00', '[\"one\",\"two\",\"three\",\"four\",\"five\",\"six\",\"seven\",\"eight\",\"nine\",\"ten\"]', NULL)")
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('branch_details', null, {});
  }
};
