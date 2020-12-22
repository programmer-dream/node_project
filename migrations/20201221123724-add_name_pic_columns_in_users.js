'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('users', 'name', {
                type: Sequelize.STRING,
                allowNull: false,
            }),
            queryInterface.addColumn('users', 'photo', {
                type: Sequelize.STRING,
                allowNull: true,
            })
        ])
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('users', 'name'),
            queryInterface.removeColumn('users', 'photo')
        ])
    }
};
