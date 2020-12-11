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
        queryInterface.addConstraint('BranchTestList', {
              type: 'FOREIGN KEY',
              fields: ['classVlsId'],
              name: 'FK_classVlsId_BranchTestList', // useful if using queryInterface.removeConstraint
              references: {
                table: 'ClassDetails',
                field: 'classVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('StudentTestReport', {
              type: 'FOREIGN KEY',
              fields: ['studentVlsId'],
              name: 'FK_studentVlsId_StudentTestReport', // useful if using queryInterface.removeConstraint
              references: {
                table: 'StudentSchoolPersonal',
                field: 'studentSchoolVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('StudentTestReport', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_StudentTestReport', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('StudentTestReport', {
              type: 'FOREIGN KEY',
              fields: ['classVlsId'],
              name: 'FK_classVlsId_StudentTestReport', // useful if using queryInterface.removeConstraint
              references: {
                table: 'ClassDetails',
                field: 'classVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('StudentSchoolPersonal', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_Student', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('StudentSchoolPersonal', {
              type: 'FOREIGN KEY',
              fields: ['passionVlsId'],
              name: 'FK_passionVlsId_Student', // useful if using queryInterface.removeConstraint
              references: {
                table: 'PassionAndInterests',
                field: 'passionVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('StudentSchoolPersonal', {
              type: 'FOREIGN KEY',
              fields: ['parentVlsId'],
              name: 'FK_ParentVlsId_Student', // useful if using queryInterface.removeConstraint
              references: {
                table: 'Parent',
                field: 'ParentVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('StudentAcademic', {
              type: 'FOREIGN KEY',
              fields: ['studentVlsId'],
              name: 'FK_studentVlsId_Student', // useful if using queryInterface.removeConstraint
              references: {
                table: 'StudentSchoolPersonal',
                field: 'studentSchoolVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('StudentAcademic', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_StudentAcademic', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('StudentAcademic', {
              type: 'FOREIGN KEY',
              fields: ['classVlsId'],
              name: 'FK_classVlsId_StudentAcademic', // useful if using queryInterface.removeConstraint
              references: {
                table: 'ClassDetails',
                field: 'classVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('facultyProfessional', {
              type: 'FOREIGN KEY',
              fields: ['facultyVlsId'],
              name: 'FK_facultyVlsId_facultyProfessional', // useful if using queryInterface.removeConstraint
              references: {
                table: 'facultyPersonal',
                field: 'facultyVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('facultyProfessional', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_facultyProfessional', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('Parent', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_Parent', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('BranchTimesheet', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_BranchTimesheet', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('StudentQuery', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_StudentQuery', // useful if using queryInterface.removeConstraint
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
        queryInterface.sequelize.query('ALTER TABLE BranchTestList DROP CONSTRAINT FK_classVlsId_BranchTestList;'),
        queryInterface.removeIndex('BranchTestList', 'FK_classVlsId_BranchTestList'),

        queryInterface.sequelize.query('ALTER TABLE StudentTestReport DROP CONSTRAINT FK_studentVlsId_StudentTestReport;'),
        queryInterface.removeIndex('StudentTestReport', 'FK_studentVlsId_StudentTestReport'),

        queryInterface.sequelize.query('ALTER TABLE StudentTestReport DROP CONSTRAINT FK_branchVlsId_StudentTestReport;'),
        queryInterface.removeIndex('StudentTestReport', 'FK_branchVlsId_StudentTestReport'),

        queryInterface.sequelize.query('ALTER TABLE StudentTestReport DROP CONSTRAINT FK_classVlsId_StudentTestReport;'),
        queryInterface.removeIndex('StudentTestReport', 'FK_classVlsId_StudentTestReport'),

        queryInterface.sequelize.query('ALTER TABLE StudentSchoolPersonal DROP CONSTRAINT FK_branchVlsId_Student;'),
        queryInterface.removeIndex('StudentSchoolPersonal', 'FK_branchVlsId_Student'),

        queryInterface.sequelize.query('ALTER TABLE StudentSchoolPersonal DROP CONSTRAINT FK_passionVlsId_Student;'),
        queryInterface.removeIndex('StudentSchoolPersonal', 'FK_passionVlsId_Student'),

        queryInterface.sequelize.query('ALTER TABLE StudentSchoolPersonal DROP CONSTRAINT FK_ParentVlsId_Student;'),
        queryInterface.removeIndex('StudentSchoolPersonal', 'FK_ParentVlsId_Student'),

        queryInterface.sequelize.query('ALTER TABLE StudentAcademic DROP CONSTRAINT FK_studentVlsId_Student;'),
        queryInterface.removeIndex('StudentAcademic', 'FK_studentVlsId_Student'),

        queryInterface.sequelize.query('ALTER TABLE StudentAcademic DROP CONSTRAINT FK_branchVlsId_StudentAcademic;'),
        queryInterface.removeIndex('StudentAcademic', 'FK_branchVlsId_StudentAcademic'),

        queryInterface.sequelize.query('ALTER TABLE StudentAcademic DROP CONSTRAINT FK_classVlsId_StudentAcademic;'),
        queryInterface.removeIndex('StudentAcademic', 'FK_classVlsId_StudentAcademic'),

        queryInterface.sequelize.query('ALTER TABLE facultyProfessional DROP CONSTRAINT FK_facultyVlsId_facultyProfessional;'),
        queryInterface.removeIndex('facultyProfessional', 'FK_facultyVlsId_facultyProfessional'),

        queryInterface.sequelize.query('ALTER TABLE facultyProfessional DROP CONSTRAINT FK_branchVlsId_facultyProfessional;'),
        queryInterface.removeIndex('facultyProfessional', 'FK_branchVlsId_facultyProfessional'),

        queryInterface.sequelize.query('ALTER TABLE BranchTimesheet DROP CONSTRAINT FK_branchVlsId_BranchTimesheet;'),
        queryInterface.removeIndex('BranchTimesheet', 'FK_branchVlsId_BranchTimesheet'),

        queryInterface.sequelize.query('ALTER TABLE StudentQuery DROP CONSTRAINT FK_branchVlsId_StudentQuery;'),
        queryInterface.removeIndex('StudentQuery', 'FK_branchVlsId_StudentQuery')
      ])
  }
};
