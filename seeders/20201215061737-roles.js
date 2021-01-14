'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return Promise.all([
      await queryInterface.bulkDelete('roles', null, {}),

      await queryInterface.sequelize.query(
        "INSERT INTO `roles` (`id`, `slug`, `name`, `note`, `is_default`, `is_super_admin`, `status`, `created_at`, `modified_at`, `created_by`, `modified_by`) VALUES (1, 'super-admin', 'Super Admin', 'Super Admin User', 1, 1, 1, '2017-08-13 12:15:17', '2018-02-09 01:58:57', 0, 1),(2, 'branch-admin', 'Branch Admin', 'Branch Admin User', 1, 0, 1, '2017-08-13 13:01:36', '2017-08-13 13:01:36', 0, 0),(3, 'guardian', 'Guardian', 'Guardian/Parent User', 1, 0, 1, '2017-08-13 13:02:05', '2018-02-09 01:59:22', 0, 1),(4, 'student', 'Student', 'Student User', 1, 0, 1, '2017-08-13 13:02:24', '2018-02-09 01:59:34', 0, 1),(5, 'teacher', 'Teacher', 'Teacher User', 1, 0, 1, '2017-08-13 13:02:51', '2018-02-09 01:59:46', 0, 1),(6, 'accountant', 'Accountant', 'Accountant User', 1, 0, 1, '2017-08-13 13:04:00', '2018-02-09 02:00:07', 0, 1),(7, 'librarian', 'Librarian', 'Librarian User', 1, 0, 1, '2017-08-13 13:04:18', '2018-02-09 02:00:22', 0, 1),(8, 'receptioniast', 'Receptioniast', 'Receptionist/ Front Desk User', 1, 0, 1, '2017-08-13 13:04:36', '2018-02-09 02:02:30', 0, 1),(9, 'staff', 'Staff', 'General Staff User', 0, 0, 1, '2017-08-13 13:05:01', '2018-02-09 02:02:48', 0, 1),(13, 'servent', 'Servent', 'Servant User', 0, 0, 1, '2018-02-04 04:40:37', '2018-02-09 02:03:09', 1, 1),(14, 'principal', 'Principal', 'Principal User', 1, 0, 1, '2018-02-04 04:40:37', '2018-02-09 02:03:09', 1, 1),(15, 'school-admin', 'School Admin User', 'School Admin User', 1, 0, 1, '2018-02-04 04:40:37', '2018-02-09 02:03:09', 1, 1)"
      ),

    ])
    
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     return queryInterface.bulkDelete('roles', null, {});
  }
};
