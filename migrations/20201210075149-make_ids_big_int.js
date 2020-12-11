'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('StudentPersonal', 'studentPersonalId', {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true
            }),
            queryInterface.changeColumn('StudentPersonal', 'studentVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('StudentSchoolPersonal', 'studentSchoolVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true
            }),
            queryInterface.changeColumn('facultyPersonal', 'facultyVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true
            }),
            queryInterface.changeColumn('facultyProfessional', 'facultyVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('Parent', 'parentVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true
            }),
            queryInterface.changeColumn('Authentication', 'userId', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('StudentSchoolPersonal', 'parentVlsId', {
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
