'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('student_vls', 'student_vls_id', {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true
            }),
            queryInterface.changeColumn('student_vls', 'student_vls_id', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('students', 'student_id', {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true
            }),
            queryInterface.changeColumn('employees', 'faculty_vls_id', {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true
            }),
            queryInterface.changeColumn('guardians', 'parent_vls_id', {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true
            }),
            queryInterface.changeColumn('users', 'user_name', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('students', 'parent_vls_id', {
                type: Sequelize.BIGINT,
                allowNull: true,
            }),
            queryInterface.changeColumn('student_vls', 'student_vls_id', {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true
            }),
            queryInterface.changeColumn('Student_vls_report', 'student_vls_id', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('student_vls', 'student_vls_id', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('student_attendances', 'student_id', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('exam_results', 'student_id', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('student_query', 'student_vls_id', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('feedback', 'student_vls_id', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('rewards', 'student_vls_id', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('recognition', 'student_vls_id', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('chat', 'sender_user_vls_id', {
                type: Sequelize.BIGINT
            }),
            queryInterface.changeColumn('chat', 'receiver_user_vls_id', {
                type: Sequelize.BIGINT
            }),
            queryInterface.changeColumn('Community_chat_communicaiton', 'sender_user_vls_id', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('mailbox', 'sender_user_vls_id', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('mailbox', 'receiver_user_vls_id', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('tickets', 'ticker_owner_vls_id', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('live_streaming', 'meeting_owner_vls_id', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('feedback', 'teacher_vls_id', {
                type: Sequelize.BIGINT,
                allowNull: false,
            }),
            queryInterface.changeColumn('feedback', 'parent_vls_id', {
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
