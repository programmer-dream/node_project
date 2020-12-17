'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('employees', 'isPrincipal', {
                type: Sequelize.TINYINT
            }),
            queryInterface.addColumn('employees', 'isAdmin', {
                type: Sequelize.TINYINT
            }),
            queryInterface.addColumn('employees', 'isTeacher', {
                type: Sequelize.TINYINT
            }),
            queryInterface.addColumn('employees', 'isOfficeStaff', {
                type: Sequelize.TINYINT
            })
        ])
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('employees', 'isPrincipal'),
            queryInterface.removeColumn('employees', 'isAdmin'),
            queryInterface.removeColumn('employees', 'isTeacher'),
            queryInterface.removeColumn('employees', 'isOfficeStaff')
        ])
    }
};
