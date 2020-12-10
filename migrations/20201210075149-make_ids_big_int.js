'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('StudentPersonal', 'StudentPersonalId', {
                type: Sequelize.BIGINT,
                allowNull: true,
            }),
            queryInterface.changeColumn('StudentPersonal', 'StudentVlsId', {
                type: Sequelize.BIGINT,
                allowNull: true,
            }),
            queryInterface.changeColumn('StudentSchoolPersonal', 'StudentSchoolVlsId', {
                type: Sequelize.BIGINT,
                allowNull: true,
            }),
            queryInterface.changeColumn('StudentSchoolPersonal', 'StudentVlsId', {
                type: Sequelize.BIGINT,
                allowNull: true,
            }),
            queryInterface.changeColumn('facultyPersonal', 'facultyVlsId', {
                type: Sequelize.BIGINT,
                allowNull: true,
            }),
            queryInterface.changeColumn('facultyProfessional', 'facultyVlsId', {
                type: Sequelize.BIGINT,
                allowNull: true,
            }),
            queryInterface.changeColumn('Parent', 'ParentVlsId', {
                type: Sequelize.BIGINT,
                allowNull: true,
            }),
            queryInterface.changeColumn('Authentication', 'UserId', {
                type: Sequelize.BIGINT,
                allowNull: true,
            }),
            queryInterface.changeColumn('StudentSchoolPersonal', 'ParentVlsId', {
                type: Sequelize.BIGINT,
                allowNull: true,
            })
        ])
    },
    down: (queryInterface, Sequelize) => {
        // return Promise.all([
        //     queryInterface.changeColumn('your table name ', 'name', {
        //         type: Sequelize.STRING,
        //         allowNull: true,
        //     }, {
        //         transaction,
        //     })
        // ])
    }
};
