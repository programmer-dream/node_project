'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('branch_details', 'subjects', {
                type: Sequelize.TEXT,
                allowNull: true,
            })
        ])
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('branch_details', 'subjects')
        ])
    }
};
