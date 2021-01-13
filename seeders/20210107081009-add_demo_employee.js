'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('employees', null, {});
    await queryInterface.sequelize.query("INSERT INTO `employees` (`faculty_vls_id`, `branch_vls_id`, `name`, `gender`, `phone`, `contact2`, `email`, `qualification1`, `degree1`, `university1`, `year1`, `degree2`, `university2`, `year2`, `degree3`, `university3`, `year3`, `father_name`, `father_qualification`, `mother_name`, `mother_qualification`, `emergency_contact`, `photo`, `present_address`, `hobbies`, `access_permission`, `spare1`, `spare2`, `spare3`, `spare4`, `spare5`, `created_at`, `updated_at`, `isPrincipal`, `isAdmin`, `isTeacher`, `isOfficeStaff`) VALUES(1, 1, 'faculty 1', NULL, '12345678890', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'father 1', NULL, 'mother 1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-12-23 00:00:00', '2020-12-23 00:00:00', NULL, NULL, 1, NULL),(2, 1, 'faculty 2', NULL, '123456789', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-12-23 00:00:00', '2020-12-23 00:00:00', NULL, NULL, 1, NULL),(3, 1, 'faculty 3', NULL, '2345555', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-12-23 00:00:00', '2020-12-23 00:00:00', NULL, NULL, 1, NULL),(4, 1, 'teacher', NULL, '2345555', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-12-23 00:00:00', '2020-12-23 00:00:00', NULL, NULL, 1, NULL),(5, 1, 'principal', NULL, '2345555', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-12-23 00:00:00', '2020-12-23 00:00:00', 1, NULL, NULL, NULL),(6, 1, 'branch admin', NULL, '2345555', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-12-23 00:00:00', '2020-12-23 00:00:00', NULL, 1, NULL, NULL),(7, 1, 'Super admin', NULL, '2345555', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-12-23 00:00:00', '2020-12-23 00:00:00', NULL, 1, NULL, NULL),(8, 1, 'faculty 8', NULL, '2345555', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-12-23 00:00:00', '2020-12-23 00:00:00', NULL, NULL, 1, NULL),(9, 1, 'admin', NULL, '2345555', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-12-23 00:00:00', '2020-12-23 00:00:00', NULL, 1, 1, NULL),(10, 1, 'School admin', NULL, '2345555', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-12-23 00:00:00', '2020-12-23 00:00:00', NULL, 1, 1, NULL)")
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('employees', null, {});
  }
};
