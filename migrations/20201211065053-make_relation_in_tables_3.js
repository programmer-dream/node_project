'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     // return Promise.all([
        await queryInterface.addConstraint('StudentQuery', {
              type: 'FOREIGN KEY',
              fields: ['studentVlsId'],
              name: 'FK_studentVlsId_StudentQuery', // useful if using queryInterface.removeConstraint
              references: {
                table: 'StudentSchoolPersonal',
                field: 'studentSchoolVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('StudentQuery', {
              type: 'FOREIGN KEY',
              fields: ['classVlsId'],
              name: 'FK_classVlsId_StudentQuery', // useful if using queryInterface.removeConstraint
              references: {
                table: 'ClassDetails',
                field: 'classVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('StudentQuery', {
              type: 'FOREIGN KEY',
              fields: ['replyVlsId'],
              name: 'FK_replyVlsId_StudentQuery', // useful if using queryInterface.removeConstraint
              references: {
                table: 'Feedback',
                field: 'replyVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('Feedback', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_replyVlsId_Feedback', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('Feedback', {
              type: 'FOREIGN KEY',
              fields: ['queryVlsId'],
              name: 'FK_queryVlsId_Feedback', // useful if using queryInterface.removeConstraint
              references: {
                table: 'StudentQuery',
                field: 'queryVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('Feedback', {
              type: 'FOREIGN KEY',
              fields: ['learningLibraryVlsId'],
              name: 'FK_learningLibraryVlsId_Feedback', // useful if using queryInterface.removeConstraint
              references: {
                table: 'LearningLibrary',
                field: 'learningLibraryVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('Feedback', {
              type: 'FOREIGN KEY',
              fields: ['liveMeetingVlsId'],
              name: 'FK_liveMeetingVlsId_Feedback', // useful if using queryInterface.removeConstraint
              references: {
                table: 'LiveStreaming',
                field: 'liveStreamVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('Feedback', {
              type: 'FOREIGN KEY',
              fields: ['ticketVlsId'],
              name: 'FK_ticketVlsId_Feedback', // useful if using queryInterface.removeConstraint
              references: {
                table: 'Tickets',
                field: 'ticketVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('Feedback', {
              type: 'FOREIGN KEY',
              fields: ['studentVlsId'],
              name: 'FK_studentVlsId_Feedback', // useful if using queryInterface.removeConstraint
              references: {
                table: 'StudentSchoolPersonal',
                field: 'studentSchoolVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('Feedback', {
              type: 'FOREIGN KEY',
              fields: ['teacherVlsId'],
              name: 'FK_teacherVlsId_Feedback', // useful if using queryInterface.removeConstraint
              references: {
                table: 'facultyProfessional',
                field: 'facultyVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('Feedback', {
              type: 'FOREIGN KEY',
              fields: ['parentVlsId'],
              name: 'FK_parentVlsId_Feedback', // useful if using queryInterface.removeConstraint
              references: {
                table: 'Parent',
                field: 'parentVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('LearningLibrary', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_BranchVlsId_LearningLibrary', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('LearningLibrary', {
              type: 'FOREIGN KEY',
              fields: ['replyVlsId'],
              name: 'FK_replyVlsId_LearningLibrary', // useful if using queryInterface.removeConstraint
              references: {
                table: 'Feedback',
                field: 'replyVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('Assignment', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_Assignment', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('AssignmentQuestions', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_AssignmentQuestions', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
     // ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
      // return Promise.all([
        await queryInterface.sequelize.query('ALTER TABLE StudentQuery DROP CONSTRAINT FK_studentVlsId_StudentQuery;');
        await queryInterface.removeIndex('StudentQuery', 'FK_studentVlsId_StudentQuery');

        await queryInterface.sequelize.query('ALTER TABLE StudentQuery DROP CONSTRAINT FK_classVlsId_StudentQuery;');
        await queryInterface.removeIndex('StudentQuery', 'FK_classVlsId_StudentQuery');

        await queryInterface.sequelize.query('ALTER TABLE StudentQuery DROP CONSTRAINT FK_replyVlsId_StudentQuery;');
        await queryInterface.removeIndex('StudentQuery', 'FK_replyVlsId_StudentQuery');

        await queryInterface.sequelize.query('ALTER TABLE Feedback DROP CONSTRAINT FK_replyVlsId_Feedback;');
        await queryInterface.removeIndex('Feedback', 'FK_replyVlsId_Feedback');

        await queryInterface.sequelize.query('ALTER TABLE Feedback DROP CONSTRAINT FK_queryVlsId_Feedback;');
        await queryInterface.removeIndex('Feedback', 'FK_queryVlsId_Feedback');

        await queryInterface.sequelize.query('ALTER TABLE Feedback DROP CONSTRAINT FK_learningLibraryVlsId_Feedback;');
        await queryInterface.removeIndex('Feedback', 'FK_learningLibraryVlsId_Feedback');

        await queryInterface.sequelize.query('ALTER TABLE Feedback DROP CONSTRAINT FK_liveMeetingVlsId_Feedback;');
        await queryInterface.removeIndex('Feedback', 'FK_liveMeetingVlsId_Feedback');

        await queryInterface.sequelize.query('ALTER TABLE Feedback DROP CONSTRAINT FK_ticketVlsId_Feedback;');
        await queryInterface.removeIndex('Feedback', 'FK_ticketVlsId_Feedback');

        await queryInterface.sequelize.query('ALTER TABLE Feedback DROP CONSTRAINT FK_studentVlsId_Feedback;');
        await queryInterface.removeIndex('Feedback', 'FK_studentVlsId_Feedback');

        await queryInterface.sequelize.query('ALTER TABLE Feedback DROP CONSTRAINT FK_teacherVlsId_Feedback;');
        await queryInterface.removeIndex('Feedback', 'FK_teacherVlsId_Feedback');

        await queryInterface.sequelize.query('ALTER TABLE Feedback DROP CONSTRAINT FK_parentVlsId_Feedback;');
        await queryInterface.removeIndex('Feedback', 'FK_parentVlsId_Feedback');

        await queryInterface.sequelize.query('ALTER TABLE LearningLibrary DROP CONSTRAINT FK_BranchVlsId_LearningLibrary;');
        await queryInterface.removeIndex('LearningLibrary', 'FK_BranchVlsId_LearningLibrary');

        await queryInterface.sequelize.query('ALTER TABLE LearningLibrary DROP CONSTRAINT FK_replyVlsId_LearningLibrary;');
        await queryInterface.removeIndex('LearningLibrary', 'FK_replyVlsId_LearningLibrary');

        await queryInterface.sequelize.query('ALTER TABLE Assignment DROP CONSTRAINT FK_branchVlsId_Assignment;');
        await queryInterface.removeIndex('Assignment', 'FK_branchVlsId_Assignment');

        await queryInterface.sequelize.query('ALTER TABLE AssignmentQuestions DROP CONSTRAINT FK_branchVlsId_AssignmentQuestions;');
        await queryInterface.removeIndex('AssignmentQuestions', 'FK_branchVlsId_AssignmentQuestions');

      // ])
  }
};
