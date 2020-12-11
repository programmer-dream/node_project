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
            }),
            queryInterface.changeColumn('StudentVls', 'studentVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true
            }),
            queryInterface.changeColumn('StudentVlsReport', 'studentVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('StudentPersonal', 'studentVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('StudentAttendance', 'studentVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('StudentTestReport', 'studentVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('StudentAcademic', 'studentVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('StudentQuery', 'studentVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('Feedback', 'studentVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('Rewards', 'studentVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('Recognition', 'studentVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('Chat', 'senderUserVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('Chat', 'receiverUserVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('CommunityChatCommunicaiton', 'senderUserVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('Mailbox', 'senderUserVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('Mailbox', 'receiverUserVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('Tickets', 'tickerOwnerVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('LiveStreaming', 'meetingOwnerVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('LiveStreaming', 'meetingCreaterVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('SubjectFaculty', 'facultyVlsId', {
                type: Sequelize.BIGINT,
                allowNull: false,
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
