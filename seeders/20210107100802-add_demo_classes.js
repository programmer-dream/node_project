'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('classes', null, {});
     await queryInterface.sequelize.query("INSERT INTO `classes` (`class_vls_id`, `branch_vls_id`, `name`, `teacher_id`, `created_at`, `updated_at`, `school_id`, `numeric_name`, `note`, `created_by`, `modified_by`, `status`) VALUES(1, 1, 'Class 1', 1, '2021-01-04 00:00:00', '2021-01-04 00:00:00', 1, 1, 'First class', 1, 1, 1),(2, 1, 'Class 2', 3, '2021-01-04 00:00:00', '2021-01-04 00:00:00', 1, 1, 'Class 2', 1, 1, 1),(3, 1, 'Class 3', 1, '2021-01-04 00:00:00', '2021-01-04 00:00:00', 1, 1, 'Class 3', 1, 1, 1),(4, 1, 'Class 4', 3, '2021-01-04 00:00:00', '2021-01-04 00:00:00', 1, 1, 'Class 4', 1, 1, 1),(5, 1, 'Class 5', 1, '2021-01-04 00:00:00', '2021-01-04 00:00:00', 1, 1, 'Class 5', 1, 1, 1),(6, 1, 'Class 6', 4, '2021-01-04 00:00:00', '2021-01-04 00:00:00', 1, 1, 'Class 6', 1, 1, 1)")
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('classes', null, {});
  }
};
