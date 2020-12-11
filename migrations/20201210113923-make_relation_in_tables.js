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
        queryInterface.addConstraint('Authentication', {
              type: 'FOREIGN KEY',
              fields: ['schoolVlsId'],
              name: 'FK_schoolVlsId_School', // useful if using queryInterface.removeConstraint
              references: {
                table: 'SchoolDetails',
                field: 'schoolVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('Authentication', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_Branch', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('Authentication', {
              type: 'FOREIGN KEY',
              fields: ['userSettingsVlsId'],
              name: 'FK_userSettingsVlsId_UserSettings', // useful if using queryInterface.removeConstraint
              references: {
                table: 'UserSettings',
                field: 'userSettingsVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('StudentVls', {
              type: 'FOREIGN KEY',
              fields: ['studentVlsId'],
              name: 'FK_studentVlsId_StudentVls', // useful if using queryInterface.removeConstraint
              references: {
                table: 'StudentSchoolPersonal',
                field: 'studentSchoolVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('StudentVlsReport', {
              type: 'FOREIGN KEY',
              fields: ['studentVlsId'],
              name: 'FK_studentVlsId_StudentVlsReports', // useful if using queryInterface.removeConstraint
              references: {
                table: 'StudentSchoolPersonal',
                field: 'studentSchoolVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('StudentPersonal', {
              type: 'FOREIGN KEY',
              fields: ['studentVlsId'],
              name: 'FK_studentVlsId_StudentPersonal', // useful if using queryInterface.removeConstraint
              references: {
                table: 'StudentSchoolPersonal',
                field: 'studentSchoolVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('StudentPersonal', {
              type: 'FOREIGN KEY',
              fields: ['passionVlsId'],
              name: 'FK_passionVlsId_PassionAndInterests', // useful if using queryInterface.removeConstraint
              references: {
                table: 'PassionAndInterests',
                field: 'passionVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('AssessmentCriteria', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_AssessmentCriteria', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('ClassDetails', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_ClassDetails', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('SubjectFaculty', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_SubjectFaculty', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('SubjectFaculty', {
              type: 'FOREIGN KEY',
              fields: ['classVlsId'],
              name: 'FK_classVlsId_SubjectFaculty', // useful if using queryInterface.removeConstraint
              references: {
                table: 'ClassDetails',
                field: 'classVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('SubjectFaculty', {
              type: 'FOREIGN KEY',
              fields: ['facultyVlsId'],
              name: 'FK_facultyVlsId_SubjectFaculty', // useful if using queryInterface.removeConstraint
              references: {
                table: 'facultyPersonal',
                field: 'facultyVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('StudentAttendance', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_StudentAttendance', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('StudentAttendance', {
              type: 'FOREIGN KEY',
              fields: ['studentVlsId'],
              name: 'FK_studentVlsId_StudentAttendance', // useful if using queryInterface.removeConstraint
              references: {
                table: 'StudentSchoolPersonal',
                field: 'studentSchoolVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('BranchTestList', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_BranchTestList', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
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
        queryInterface.sequelize.query('ALTER TABLE Authentication DROP CONSTRAINT FK_schoolVlsId_School;'),
        queryInterface.removeIndex('Authentication', 'FK_schoolVlsId_School'),

        queryInterface.sequelize.query('ALTER TABLE Authentication DROP CONSTRAINT FK_branchVlsId_Branch;'),
        queryInterface.removeIndex('Authentication', 'FK_branchVlsId_Branch'),

        queryInterface.sequelize.query('ALTER TABLE Authentication DROP CONSTRAINT FK_userSettingsVlsId_UserSettings;'),
        queryInterface.removeIndex('Authentication', 'FK_userSettingsVlsId_UserSettings'),

        queryInterface.sequelize.query('ALTER TABLE StudentVls DROP CONSTRAINT FK_studentVlsId_StudentVls;'),
        queryInterface.removeIndex('StudentVls', 'FK_studentVlsId_StudentVls'),

        queryInterface.sequelize.query('ALTER TABLE StudentVlsReport DROP CONSTRAINT FK_studentVlsId_StudentVlsReports;'),
        queryInterface.removeIndex('StudentVlsReport', 'FK_studentVlsId_StudentVlsReports'),

        queryInterface.sequelize.query('ALTER TABLE StudentPersonal DROP CONSTRAINT FK_studentVlsId_StudentPersonal;'),
        queryInterface.removeIndex('StudentPersonal', 'FK_studentVlsId_StudentPersonal'),

        queryInterface.sequelize.query('ALTER TABLE StudentPersonal DROP CONSTRAINT FK_passionVlsId_PassionAndInterests;'),
        queryInterface.removeIndex('StudentPersonal', 'FK_passionVlsId_PassionAndInterests'),

        queryInterface.sequelize.query('ALTER TABLE AssessmentCriteria DROP CONSTRAINT FK_branchVlsId_AssessmentCriteria;'),
        queryInterface.removeIndex('AssessmentCriteria', 'FK_branchVlsId_AssessmentCriteria'),

        queryInterface.sequelize.query('ALTER TABLE ClassDetails DROP CONSTRAINT FK_branchVlsId_ClassDetails;'),
        queryInterface.removeIndex('ClassDetails', 'FK_branchVlsId_ClassDetails'),

        queryInterface.sequelize.query('ALTER TABLE SubjectFaculty DROP CONSTRAINT FK_branchVlsId_SubjectFaculty;'),
        queryInterface.removeIndex('SubjectFaculty', 'FK_branchVlsId_SubjectFaculty'),

        queryInterface.sequelize.query('ALTER TABLE SubjectFaculty DROP CONSTRAINT FK_branchVlsId_SubjectFaculty;'),
        queryInterface.removeIndex('SubjectFaculty', 'FK_branchVlsId_SubjectFaculty'),

        queryInterface.sequelize.query('ALTER TABLE SubjectFaculty DROP CONSTRAINT FK_facultyVlsId_SubjectFaculty;'),
        queryInterface.removeIndex('SubjectFaculty', 'FK_facultyVlsId_SubjectFaculty'),

        queryInterface.sequelize.query('ALTER TABLE StudentAttendance DROP CONSTRAINT FK_branchVlsId_StudentAttendance;'),
        queryInterface.removeIndex('StudentAttendance', 'FK_branchVlsId_StudentAttendance'),

        queryInterface.sequelize.query('ALTER TABLE StudentAttendance DROP CONSTRAINT FK_studentVlsId_StudentAttendance;'),
        queryInterface.removeIndex('StudentAttendance', 'FK_studentVlsId_StudentAttendance'),

        queryInterface.sequelize.query('ALTER TABLE BranchTestList DROP CONSTRAINT FK_branchVlsId_BranchTestList;'),
        queryInterface.removeIndex('BranchTestList', 'FK_branchVlsId_BranchTestList')
      ])
  }
};
