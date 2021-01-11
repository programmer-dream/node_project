'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('subjects', null, {});
     await queryInterface.sequelize.query("INSERT INTO `subjects` (`subject_vls_id`, `branch_vls_id`, `class_id`, `teacher_id`, `name`, `created_at`, `updated_at`, `school_id`, `type`, `code`, `author`, `status`, `note`, `created_by`, `modified_by`) VALUES(1, 1, 1, 1, 'Hindi', '2021-01-04 00:00:00', '2021-01-04 00:00:00', 1, '', '001', NULL, NULL, NULL, NULL, NULL),(2, 1, 1, 1, 'English', '2021-01-04 00:00:00', '2021-01-04 00:00:00', 1, '', '002', NULL, NULL, NULL, NULL, NULL),(3, 1, 1, 2, 'Hindi', '2021-01-04 00:00:00', '2021-01-04 00:00:00', 1, '', '001', NULL, NULL, NULL, NULL, NULL),(4, 1, 1, 1, 'Punjabi', '2021-01-04 00:00:00', '2021-01-04 00:00:00', 1, '', '003', NULL, NULL, NULL, NULL, NULL),(5, 1, 1, 1, 'Subject 1', '2021-01-04 00:00:00', '2021-01-04 00:00:00', 1, '', '004', NULL, NULL, NULL, NULL, NULL)")
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('subjects', null, {});
  }
};
