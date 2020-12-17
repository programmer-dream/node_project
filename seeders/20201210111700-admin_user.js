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
    return queryInterface.bulkInsert('users', [{
      user_name: Date.now(),
      password: '$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi', // test@123
      old_passwords: '["$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi"]',
      role_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     return queryInterface.bulkDelete('users', null, {});
  }
};
