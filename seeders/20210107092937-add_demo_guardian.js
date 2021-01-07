'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('guardians', null, {});
     await queryInterface.sequelize.query("INSERT INTO `guardians` (`parent_vls_id`, `branch_vls_id`, `name`, `dob`, `phone`, `contact2`, `email`, `qualification1`, `photo`, `present_address`, `hobbies`, `emergency_contact`, `created_at`, `updated_at`) VALUES (NULL, '1', 'Gauardian', '1991-01-07 00:00:00', '1223', '123', 'test@gmail.com', 'test', NULL, 'test', 'tests', NULL, '2021-01-07 00:00:00', '2021-01-07 00:00:00')")
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('guardians', null, {});
  }
};
