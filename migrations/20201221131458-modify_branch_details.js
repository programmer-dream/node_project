'use strict';

'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.renameColumn('branch_details', 'learning_library_suport', 'learning_library_support'),
            queryInterface.changeColumn('branch_details', 'video_library_support', {
                type: Sequelize.ENUM('yes','no')
            }),
            queryInterface.changeColumn('branch_details', 'assignment_support', {
                type: Sequelize.ENUM('yes','no')
            }),
            queryInterface.changeColumn('branch_details', 'chat_support', {
                type: Sequelize.ENUM('yes','no')
            }),
            queryInterface.changeColumn('branch_details', 'rewards_and_recognition_support', {
                type: Sequelize.ENUM('yes','no')
            }),
            queryInterface.changeColumn('branch_details', 'notification_support', {
                type: Sequelize.ENUM('yes','no')
            }),
            queryInterface.changeColumn('branch_details', 'community_chat_support', {
                type: Sequelize.ENUM('yes','no')
            }),
            queryInterface.changeColumn('branch_details', 'alert_support', {
                type: Sequelize.ENUM('yes','no')
            }),
            queryInterface.changeColumn('branch_details', 'mailbox_support', {
                type: Sequelize.ENUM('yes','no')
            }),
            queryInterface.changeColumn('branch_details', 'ERP_support', {
                type: Sequelize.ENUM('yes','no')
            }),
            queryInterface.addColumn('branch_details', 'learning_library_support_type', {
                type: Sequelize.ENUM('SMS','Email','Both')
            })
        ])
    },
    down: (queryInterface, Sequelize) => {
        //
    }
};

