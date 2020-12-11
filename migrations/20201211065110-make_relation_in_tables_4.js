'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.addConstraint('AssignmentQuestions', {
              type: 'FOREIGN KEY',
              fields: ['assignmentVlsId'],
              name: 'FK_assignmentVlsId_AssignmentQuestions', // useful if using await queryInterface.removeConstraint
              references: {
                table: 'Assignment',
                field: 'assignmentVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('StudentAssignment', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_StudentAssignment', // useful if using await queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('StudentAssignment', {
              type: 'FOREIGN KEY',
              fields: ['assignmentVlsId'],
              name: 'FK_assignmentVlsId_StudentAssignment', // useful if using await queryInterface.removeConstraint
              references: {
                table: 'Assignment',
                field: 'assignmentVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('Chat', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_Chat', // useful if using await queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('CommunityChat', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_CommunityChat', // useful if using await queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('CommunityChatCommunicaiton', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_CommunityChatCommunicaiton', // useful if using await queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('CommunityChatCommunicaiton', {
              type: 'FOREIGN KEY',
              fields: ['communityChatVlsId'],
              name: 'FK_communityChatVlsId_CommunityChatCommunicaiton', // useful if using await queryInterface.removeConstraint
              references: {
                table: 'CommunityChat',
                field: 'communityChatVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('Notification', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_Notification', // useful if using await queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('Mailbox', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_Mailbox', // useful if using await queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('Mailbox', {
              type: 'FOREIGN KEY',
              fields: ['messageVlsId'],
              name: 'FK_messageVlsId_Mailbox', // useful if using await queryInterface.removeConstraint
              references: {
                table: 'Notification',
                field: 'notificationVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
        await queryInterface.sequelize.query('ALTER TABLE AssignmentQuestions DROP CONSTRAINT FK_assignmentVlsId_AssignmentQuestions;');
        await queryInterface.removeIndex('AssignmentQuestions', 'FK_assignmentVlsId_AssignmentQuestions');

        await queryInterface.sequelize.query('ALTER TABLE StudentAssignment DROP CONSTRAINT FK_branchVlsId_StudentAssignment;');
        await queryInterface.removeIndex('StudentAssignment', 'FK_branchVlsId_StudentAssignment');

        await queryInterface.sequelize.query('ALTER TABLE StudentAssignment DROP CONSTRAINT FK_assignmentVlsId_StudentAssignment;');
        await queryInterface.removeIndex('StudentAssignment', 'FK_assignmentVlsId_StudentAssignment');

        await queryInterface.sequelize.query('ALTER TABLE Chat DROP CONSTRAINT FK_branchVlsId_Chat;');
        await queryInterface.removeIndex('Chat', 'FK_branchVlsId_Chat');

        await queryInterface.sequelize.query('ALTER TABLE CommunityChat DROP CONSTRAINT FK_branchVlsId_CommunityChat;');
        await queryInterface.removeIndex('CommunityChat', 'FK_branchVlsId_CommunityChat');

        await queryInterface.sequelize.query('ALTER TABLE CommunityChatCommunicaiton DROP CONSTRAINT FK_branchVlsId_CommunityChatCommunicaiton;');
        await queryInterface.removeIndex('CommunityChatCommunicaiton', 'FK_branchVlsId_CommunityChatCommunicaiton');        

        await queryInterface.sequelize.query('ALTER TABLE CommunityChatCommunicaiton DROP CONSTRAINT FK_communityChatVlsId_CommunityChatCommunicaiton;');
        await queryInterface.removeIndex('CommunityChatCommunicaiton', 'FK_communityChatVlsId_CommunityChatCommunicaiton');

        await queryInterface.sequelize.query('ALTER TABLE Notification DROP CONSTRAINT FK_branchVlsId_Notification;');
        await queryInterface.removeIndex('Notification', 'FK_branchVlsId_Notification');

        await queryInterface.sequelize.query('ALTER TABLE Mailbox DROP CONSTRAINT FK_branchVlsId_Mailbox;');
        await queryInterface.removeIndex('Mailbox', 'FK_branchVlsId_Mailbox');

        await queryInterface.sequelize.query('ALTER TABLE Mailbox DROP CONSTRAINT FK_messageVlsId_Mailbox;');
        await queryInterface.removeIndex('Mailbox', 'FK_messageVlsId_Mailbox');

        await queryInterface.sequelize.query('ALTER TABLE Rewards DROP CONSTRAINT FK_branchVlsId_Rewards;');
        await queryInterface.removeIndex('Rewards', 'FK_branchVlsId_Rewards');

        await queryInterface.sequelize.query('ALTER TABLE Rewards DROP CONSTRAINT FK_studentVlsId_Rewards;');
        await queryInterface.removeIndex('Rewards', 'FK_studentVlsId_Rewards');

  }
};
