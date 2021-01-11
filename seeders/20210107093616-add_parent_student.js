'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('students', null, {});
     await queryInterface.sequelize.query("INSERT INTO `students` (`student_vls_id`, `branch_vls_id`, `name`, `subject`, `dob`, `gender`, `phone`, `contact2`, `email`, `father_name`, `father_qualification`, `mother_name`, `mother_qualification`, `photo`, `present_address`, `hobbies`, `parent_vls_id`, `passion_vls_id`, `spare1`, `spare2`, `spare3`, `spare4`, `spare5`, `created_at`, `updated_at`, `class_id`, `section_id`, `school_id`) VALUES(1, 1, 'Deepak Mehra', NULL, '2020-12-22 00:00:00', 'M', '7778887773', NULL, 'Deepakmehra149@gmail.com', '', NULL, '', NULL, '', '#2744 sector 22 ,c ', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, '2020-12-22 00:00:00', '2020-12-22 00:00:00', 1, 1, 1)")
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('students', null, {});
  }
};
