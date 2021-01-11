'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('academic_years', null, {});
     await queryInterface.sequelize.query("INSERT INTO `academic_years` (`id`, `school_id`, `session_year`, `start_year`, `end_year`, `note`, `is_running`, `status`, `created_at`, `modified_at`, `created_by`, `modified_by`) VALUES(1, 1, '2021', 2020, 2021, 'test', 1, 1, '2021-01-05 00:00:00', '2021-01-05 00:00:00', 1, 1)")
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('academic_years', null, {});
  }
};
