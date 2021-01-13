'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('subject_list', null, {});
     await queryInterface.sequelize.query("INSERT INTO `subject_list` (`id`, `subject_name`, `code`, `school_vls_id`, `branch_vls_id`, `created_at`, `updated_at`) VALUES(1, 'Hindi', '001', 1, 1, '2021-01-05 00:00:00', '2021-01-05 00:00:00'),(2, 'English', '002', 1, 1, '2021-01-05 00:00:00', '2021-01-05 00:00:00'),(3, 'Punjabi', '003', 1, 1, '2021-01-05 00:00:00', '2021-01-05 00:00:00'),(4, 'Subject 1', '004', 1, 1, '2021-01-05 00:00:00', '2021-01-05 00:00:00'),(5, 'Punjabi', '005', null, null, '2021-01-05 00:00:00', '2021-01-05 00:00:00'),(6, 'English', '006', null, null, '2021-01-05 00:00:00', '2021-01-05 00:00:00'),(7, 'Math', '007', null, null, '2021-01-05 00:00:00', '2021-01-05 00:00:00')")
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('subject_list', null, {});
  }
};
