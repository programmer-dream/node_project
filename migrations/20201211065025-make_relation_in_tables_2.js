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
        await queryInterface.addConstraint('BranchTestList', {
              type: 'FOREIGN KEY',
              fields: ['classVlsId'],
              name: 'FK_classVlsId_BranchTestList', // useful if using queryInterface.removeConstraint
              references: {
                table: 'ClassDetails',
                field: 'classVlsId',
              },
              onDelete: 'CASCADE',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('StudentTestReport', {
              type: 'FOREIGN KEY',
              fields: ['studentVlsId'],
              name: 'FK_studentVlsId_StudentTestReport', // useful if using queryInterface.removeConstraint
              references: {
                table: 'StudentSchoolPersonal',
                field: 'studentSchoolVlsId',
              },
              onDelete: 'CASCADE',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('StudentTestReport', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_StudentTestReport', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'CASCADE',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('StudentTestReport', {
              type: 'FOREIGN KEY',
              fields: ['classVlsId'],
              name: 'FK_classVlsId_StudentTestReport', // useful if using queryInterface.removeConstraint
              references: {
                table: 'ClassDetails',
                field: 'classVlsId',
              },
              onDelete: 'CASCADE',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('StudentSchoolPersonal', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_Student', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'CASCADE',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('StudentSchoolPersonal', {
              type: 'FOREIGN KEY',
              fields: ['passionVlsId'],
              name: 'FK_passionVlsId_Student', // useful if using queryInterface.removeConstraint
              references: {
                table: 'PassionAndInterests',
                field: 'passionVlsId',
              },
              onDelete: 'CASCADE',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('StudentSchoolPersonal', {
              type: 'FOREIGN KEY',
              fields: ['parentVlsId'],
              name: 'FK_ParentVlsId_Student', // useful if using queryInterface.removeConstraint
              references: {
                table: 'Parent',
                field: 'ParentVlsId',
              },
              onDelete: 'CASCADE',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('StudentAcademic', {
              type: 'FOREIGN KEY',
              fields: ['studentVlsId'],
              name: 'FK_studentVlsId_Student', // useful if using queryInterface.removeConstraint
              references: {
                table: 'StudentSchoolPersonal',
                field: 'studentSchoolVlsId',
              },
              onDelete: 'CASCADE',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('StudentAcademic', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_StudentAcademic', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'CASCADE',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('StudentAcademic', {
              type: 'FOREIGN KEY',
              fields: ['classVlsId'],
              name: 'FK_classVlsId_StudentAcademic', // useful if using queryInterface.removeConstraint
              references: {
                table: 'ClassDetails',
                field: 'classVlsId',
              },
              onDelete: 'CASCADE',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('facultyProfessional', {
              type: 'FOREIGN KEY',
              fields: ['facultyVlsId'],
              name: 'FK_facultyVlsId_facultyProfessional', // useful if using queryInterface.removeConstraint
              references: {
                table: 'facultyPersonal',
                field: 'facultyVlsId',
              },
              onDelete: 'CASCADE',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('facultyProfessional', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_facultyProfessional', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'CASCADE',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('Parent', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_Parent', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'CASCADE',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('BranchTimesheet', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_BranchTimesheet', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'CASCADE',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('StudentQuery', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_StudentQuery', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'CASCADE',
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

        await queryInterface.sequelize.query('ALTER TABLE BranchTestList DROP CONSTRAINT FK_classVlsId_BranchTestList;');
        await queryInterface.removeIndex('BranchTestList', 'FK_classVlsId_BranchTestList');

        await queryInterface.sequelize.query('ALTER TABLE StudentTestReport DROP CONSTRAINT FK_studentVlsId_StudentTestReport;');
        await queryInterface.removeIndex('StudentTestReport', 'FK_studentVlsId_StudentTestReport');

        await queryInterface.sequelize.query('ALTER TABLE StudentTestReport DROP CONSTRAINT FK_branchVlsId_StudentTestReport;');
        await queryInterface.removeIndex('StudentTestReport', 'FK_branchVlsId_StudentTestReport');

        await queryInterface.sequelize.query('ALTER TABLE StudentTestReport DROP CONSTRAINT FK_classVlsId_StudentTestReport;');
        await queryInterface.removeIndex('StudentTestReport', 'FK_classVlsId_StudentTestReport');

        await queryInterface.sequelize.query('ALTER TABLE StudentSchoolPersonal DROP CONSTRAINT FK_branchVlsId_Student;');
        await queryInterface.removeIndex('StudentSchoolPersonal', 'FK_branchVlsId_Student');

        await queryInterface.sequelize.query('ALTER TABLE StudentSchoolPersonal DROP CONSTRAINT FK_passionVlsId_Student;');
        await queryInterface.removeIndex('StudentSchoolPersonal', 'FK_passionVlsId_Student');

        await queryInterface.sequelize.query('ALTER TABLE StudentSchoolPersonal DROP CONSTRAINT FK_ParentVlsId_Student;');
        await queryInterface.removeIndex('StudentSchoolPersonal', 'FK_ParentVlsId_Student');

        await queryInterface.sequelize.query('ALTER TABLE StudentAcademic DROP CONSTRAINT FK_studentVlsId_Student;');
        await queryInterface.removeIndex('StudentAcademic', 'FK_studentVlsId_Student');

        await queryInterface.sequelize.query('ALTER TABLE StudentAcademic DROP CONSTRAINT FK_branchVlsId_StudentAcademic;');
        await queryInterface.removeIndex('StudentAcademic', 'FK_branchVlsId_StudentAcademic');

        await queryInterface.sequelize.query('ALTER TABLE StudentAcademic DROP CONSTRAINT FK_classVlsId_StudentAcademic;');
        await queryInterface.removeIndex('StudentAcademic', 'FK_classVlsId_StudentAcademic');

        await queryInterface.sequelize.query('ALTER TABLE facultyProfessional DROP CONSTRAINT FK_facultyVlsId_facultyProfessional;');
        await queryInterface.removeIndex('facultyProfessional', 'FK_facultyVlsId_facultyProfessional');

        await queryInterface.sequelize.query('ALTER TABLE facultyProfessional DROP CONSTRAINT FK_branchVlsId_facultyProfessional;');
        await queryInterface.removeIndex('facultyProfessional', 'FK_branchVlsId_facultyProfessional');

        await queryInterface.sequelize.query('ALTER TABLE BranchTimesheet DROP CONSTRAINT FK_branchVlsId_BranchTimesheet;');
        await queryInterface.removeIndex('BranchTimesheet', 'FK_branchVlsId_BranchTimesheet');

        await queryInterface.sequelize.query('ALTER TABLE StudentQuery DROP CONSTRAINT FK_branchVlsId_StudentQuery;');
        await queryInterface.removeIndex('StudentQuery', 'FK_branchVlsId_StudentQuery');
      // ])
  }
};
