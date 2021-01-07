'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('sections', null, {});
     await queryInterface.sequelize.query("INSERT INTO `sections` (`id`, `branch_vls_id`, `school_id`, `class_id`, `teacher_id`, `name`, `note`, `status`, `created_at`, `modified_at`, `created_by`, `modified_by`) VALUES(1, 1, 1, 1, 1, 'Section 1', 'Section 1', 1, '2021-01-04 00:00:00', '2021-01-04 00:00:00', 1, 1),(2, 1, 1, 2, 3, 'Section 1', 'Section 1 from second class', 1, '2021-01-04 00:00:00', '2021-01-04 00:00:00', 1, 1),(3, 1, 1, 6, 4, 'Section 1', 'Section 1 other teacher', 1, '2021-01-04 00:00:00', '2021-01-04 00:00:00', 1, 1)")
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('sections', null, {});
  }
};
