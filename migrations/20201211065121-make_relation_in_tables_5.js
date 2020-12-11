'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.addConstraint('Recognition', {
               type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_Recognition', // useful if using await queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('Recognition', {
               type: 'FOREIGN KEY',
              fields: ['studentVlsId'],
              name: 'FK_studentVlsId_Recognition', // useful if using await queryInterface.removeConstraint
              references: {
                table: 'StudentSchoolPersonal',
                field: 'studentSchoolVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });
        await queryInterface.addConstraint('Tickets', {
               type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_Tickets', // useful if using await queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        });

        await queryInterface.addConstraint('LiveStreaming', {
               type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_LiveStreaming', // useful if using await queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
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
        await queryInterface.sequelize.query('ALTER TABLE Recognition DROP CONSTRAINT FK_branchVlsId_Recognition;');
        await queryInterface.removeIndex('Recognition', 'FK_branchVlsId_Recognition');

        await queryInterface.sequelize.query('ALTER TABLE Recognition DROP CONSTRAINT FK_studentVlsId_Recognition;');
        await queryInterface.removeIndex('Recognition', 'FK_studentVlsId_Recognition');

        await queryInterface.sequelize.query('ALTER TABLE Tickets DROP CONSTRAINT FK_branchVlsId_Tickets;');
        await queryInterface.removeIndex('Tickets', 'FK_branchVlsId_Tickets');

        await queryInterface.sequelize.query('ALTER TABLE LiveStreaming DROP CONSTRAINT FK_branchVlsId_LiveStreaming;');
        await queryInterface.removeIndex('LiveStreaming', 'FK_branchVlsId_LiveStreaming');

  }
};
