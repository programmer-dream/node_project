'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('users', 'forget_pwd_otp', {
                type: Sequelize.STRING,
                allowNull: true,
            })
        ])
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('users', 'forget_pwd_otp')
        ])
    }
};
