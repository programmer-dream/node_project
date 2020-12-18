'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('student_query', 'faculty_vls_id', {
                type: Sequelize.INTEGER,
                allowNull: true,
            })
        ])
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('student_query', 'faculty_vls_id')
        ])
    }
};
