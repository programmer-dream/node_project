'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.renameColumn('school', 'learning_library_suport', 'learning_library_support'),
            queryInterface.changeColumn('school', 'video_library_support', {
                type: Sequelize.ENUM('yes','no')
            }),
            queryInterface.changeColumn('school', 'assignment_support', {
                type: Sequelize.ENUM('yes','no')
            }),
            queryInterface.changeColumn('school', 'chat_support', {
                type: Sequelize.ENUM('yes','no')
            }),
            queryInterface.changeColumn('school', 'rewards_and_recognition_support', {
                type: Sequelize.ENUM('yes','no')
            }),
            queryInterface.changeColumn('school', 'notification_support', {
                type: Sequelize.ENUM('yes','no')
            }),
            queryInterface.changeColumn('school', 'community_chat_support', {
                type: Sequelize.ENUM('yes','no')
            }),
            queryInterface.changeColumn('school', 'alert_support', {
                type: Sequelize.ENUM('yes','no')
            }),
            queryInterface.changeColumn('school', 'mailbox_support', {
                type: Sequelize.ENUM('yes','no')
            }),
            queryInterface.changeColumn('school', 'ERP_support', {
                type: Sequelize.ENUM('yes','no')
            }),
            queryInterface.addColumn('school', 'learning_library_support_type', {
                type: Sequelize.ENUM('SMS','Email','Both')
            })
        ])
    },
    down: (queryInterface, Sequelize) => {
        //
    }
};
