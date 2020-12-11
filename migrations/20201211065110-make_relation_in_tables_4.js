'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     return Promise.all([
        queryInterface.addConstraint('AssignmentQuestions', {
              type: 'FOREIGN KEY',
              fields: ['assignmentVlsId'],
              name: 'FK_assignmentVlsId_AssignmentQuestions', // useful if using queryInterface.removeConstraint
              references: {
                table: 'Assignment',
                field: 'assignmentVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('StudentAssignment', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_StudentAssignment', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('StudentAssignment', {
              type: 'FOREIGN KEY',
              fields: ['assignmentVlsId'],
              name: 'FK_assignmentVlsId_StudentAssignment', // useful if using queryInterface.removeConstraint
              references: {
                table: 'Assignment',
                field: 'assignmentVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('Chat', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_Chat', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('Chat', {
              type: 'FOREIGN KEY',
              fields: ['senderUserVlsId', 'receiverUserVlsId'],
              name: 'FK_senderReceiverUserVlsId_Chat', // useful if using queryInterface.removeConstraint
              references: {
                table: 'Authentication',
                field: 'userVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('CommunityChat', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_CommunityChat', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('CommunityChatCommunicaiton', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_CommunityChatCommunicaiton', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('CommunityChatCommunicaiton', {
              type: 'FOREIGN KEY',
              fields: ['communityChatVlsId'],
              name: 'FK_communityChatVlsId_CommunityChatCommunicaiton', // useful if using queryInterface.removeConstraint
              references: {
                table: 'CommunityChat',
                field: 'communityChatVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('CommunityChatCommunicaiton', {
              type: 'FOREIGN KEY',
              fields: ['senderUserVlsId'],
              name: 'FK_senderUserVlsId_CommunityChatCommunicaiton', // useful if using queryInterface.removeConstraint
              references: {
                table: 'Authentication',
                field: 'userVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('Notification', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_Notification', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('Mailbox', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_Mailbox', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('Mailbox', {
              type: 'FOREIGN KEY',
              fields: ['messageVlsId'],
              name: 'FK_messageVlsId_Mailbox', // useful if using queryInterface.removeConstraint
              references: {
                table: 'Notification',
                field: 'notificationVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('Mailbox', {
              type: 'FOREIGN KEY',
              fields: ['senderUserVlsId', 'receiverUserVlsId'],
              name: 'FK_senderReceiverUserVlsId_Mailbox', // useful if using queryInterface.removeConstraint
              references: {
                table: 'Authentication',
                field: 'userVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        })
     ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
      return Promise.all([
        queryInterface.sequelize.query('ALTER TABLE AssignmentQuestions DROP CONSTRAINT FK_assignmentVlsId_AssignmentQuestions;'),
        queryInterface.removeIndex('AssignmentQuestions', 'FK_assignmentVlsId_AssignmentQuestions'),

        queryInterface.sequelize.query('ALTER TABLE StudentAssignment DROP CONSTRAINT FK_branchVlsId_StudentAssignment;'),
        queryInterface.removeIndex('StudentAssignment', 'FK_branchVlsId_StudentAssignment'),

        queryInterface.sequelize.query('ALTER TABLE StudentAssignment DROP CONSTRAINT FK_assignmentVlsId_StudentAssignment;'),
        queryInterface.removeIndex('StudentAssignment', 'FK_assignmentVlsId_StudentAssignment'),

        queryInterface.sequelize.query('ALTER TABLE Chat DROP CONSTRAINT FK_branchVlsId_Chat;'),
        queryInterface.removeIndex('Chat', 'FK_branchVlsId_Chat'),

        queryInterface.sequelize.query('ALTER TABLE Chat DROP CONSTRAINT FK_senderReceiverUserVlsId_Chat;'),
        queryInterface.removeIndex('Chat', 'FK_senderReceiverUserVlsId_Chat'),

        queryInterface.sequelize.query('ALTER TABLE CommunityChat DROP CONSTRAINT FK_branchVlsId_CommunityChat;'),
        queryInterface.removeIndex('CommunityChat', 'FK_branchVlsId_CommunityChat'),

        queryInterface.sequelize.query('ALTER TABLE CommunityChatCommunicaiton DROP CONSTRAINT FK_branchVlsId_CommunityChatCommunicaiton;'),
        queryInterface.removeIndex('CommunityChatCommunicaiton', 'FK_branchVlsId_CommunityChatCommunicaiton'),        

        queryInterface.sequelize.query('ALTER TABLE CommunityChatCommunicaiton DROP CONSTRAINT FK_communityChatVlsId_CommunityChatCommunicaiton;'),
        queryInterface.removeIndex('CommunityChatCommunicaiton', 'FK_communityChatVlsId_CommunityChatCommunicaiton'),

        queryInterface.sequelize.query('ALTER TABLE CommunityChatCommunicaiton DROP CONSTRAINT FK_senderUserVlsId_CommunityChatCommunicaiton;'),
        queryInterface.removeIndex('CommunityChatCommunicaiton', 'FK_senderUserVlsId_CommunityChatCommunicaiton'),

        queryInterface.sequelize.query('ALTER TABLE Notification DROP CONSTRAINT FK_branchVlsId_Notification;'),
        queryInterface.removeIndex('Notification', 'FK_branchVlsId_Notification'),

        queryInterface.sequelize.query('ALTER TABLE Mailbox DROP CONSTRAINT FK_branchVlsId_Mailbox;'),
        queryInterface.removeIndex('Mailbox', 'FK_branchVlsId_Mailbox'),

        queryInterface.sequelize.query('ALTER TABLE Mailbox DROP CONSTRAINT FK_messageVlsId_Mailbox;'),
        queryInterface.removeIndex('Mailbox', 'FK_messageVlsId_Mailbox'),

        queryInterface.sequelize.query('ALTER TABLE Mailbox DROP CONSTRAINT FK_senderReceiverUserVlsId_Mailbox;'),
        queryInterface.removeIndex('Mailbox', 'FK_senderReceiverUserVlsId_Mailbox'),

        queryInterface.sequelize.query('ALTER TABLE Rewards DROP CONSTRAINT FK_branchVlsId_Rewards;'),
        queryInterface.removeIndex('Rewards', 'FK_branchVlsId_Rewards'),

        queryInterface.sequelize.query('ALTER TABLE Rewards DROP CONSTRAINT FK_studentVlsId_Rewards;'),
        queryInterface.removeIndex('Rewards', 'FK_studentVlsId_Rewards')
      ])
  }
};
