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
        queryInterface.addConstraint('Recognition', {
               type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_Recognition', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('Recognition', {
               type: 'FOREIGN KEY',
              fields: ['studentVlsId'],
              name: 'FK_studentVlsId_Recognition', // useful if using queryInterface.removeConstraint
              references: {
                table: 'StudentSchoolPersonal',
                field: 'studentSchoolVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('Recognition', {
               type: 'FOREIGN KEY',
              fields: ['teacherVlsId'],
              name: 'FK_teacherVlsId_Recognition', // useful if using queryInterface.removeConstraint
              references: {
                table: 'facultyProfessional',
                field: 'facultyVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('Tickets', {
               type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_Tickets', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('Tickets', {
               type: 'FOREIGN KEY',
              fields: ['tickerOwnerVlsId'],
              name: 'FK_tickerOwnerVlsId_Tickets', // useful if using queryInterface.removeConstraint
              references: {
                table: 'Authentication',
                field: 'userVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('LiveStreaming', {
               type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_LiveStreaming', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('LiveStreaming', {
               type: 'FOREIGN KEY',
              fields: ['meetingOwnerVlsId', 'meetingCreaterVlsId'],
              name: 'FK_meetingOwnerCreaterUserVlsId_LiveStreaming', // useful if using queryInterface.removeConstraint
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
        queryInterface.sequelize.query('ALTER TABLE Recognition DROP CONSTRAINT FK_branchVlsId_Recognition;'),
        queryInterface.removeIndex('Recognition', 'FK_branchVlsId_Recognition'),

        queryInterface.sequelize.query('ALTER TABLE Recognition DROP CONSTRAINT FK_studentVlsId_Recognition;'),
        queryInterface.removeIndex('Recognition', 'FK_studentVlsId_Recognition'),

        queryInterface.sequelize.query('ALTER TABLE Recognition DROP CONSTRAINT FK_teacherVlsId_Recognition;'),
        queryInterface.removeIndex('Recognition', 'FK_teacherVlsId_Recognition'),

        queryInterface.sequelize.query('ALTER TABLE Tickets DROP CONSTRAINT FK_teacherVlsId_Recognition;'),
        queryInterface.removeIndex('Tickets', 'FK_teacherVlsId_Recognition'),

        queryInterface.sequelize.query('ALTER TABLE Tickets DROP CONSTRAINT FK_tickerOwnerVlsId_Tickets;'),
        queryInterface.removeIndex('Tickets', 'FK_tickerOwnerVlsId_Tickets'),

        queryInterface.sequelize.query('ALTER TABLE LiveStreaming DROP CONSTRAINT FK_branchVlsId_LiveStreaming;'),
        queryInterface.removeIndex('LiveStreaming', 'FK_branchVlsId_LiveStreaming'),

        queryInterface.sequelize.query('ALTER TABLE LiveStreaming DROP CONSTRAINT FK_meetingOwnerCreaterUserVlsId_LiveStreaming;'),
        queryInterface.removeIndex('LiveStreaming', 'FK_meetingOwnerCreaterUserVlsId_LiveStreaming')
      ])
  }
};
