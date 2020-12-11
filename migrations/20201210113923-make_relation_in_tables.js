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
        }),
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
        }),
        queryInterface.addConstraint('StudentQuery', {
              type: 'FOREIGN KEY',
              fields: ['studentVlsId'],
              name: 'FK_studentVlsId_StudentQuery', // useful if using queryInterface.removeConstraint
              references: {
                table: 'StudentSchoolPersonal',
                field: 'studentSchoolVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('StudentQuery', {
              type: 'FOREIGN KEY',
              fields: ['classVlsId'],
              name: 'FK_classVlsId_StudentQuery', // useful if using queryInterface.removeConstraint
              references: {
                table: 'ClassDetails',
                field: 'classVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('StudentQuery', {
              type: 'FOREIGN KEY',
              fields: ['replyVlsId'],
              name: 'FK_replyVlsId_StudentQuery', // useful if using queryInterface.removeConstraint
              references: {
                table: 'Feedback',
                field: 'replyVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('Feedback', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_replyVlsId_Feedback', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('Feedback', {
              type: 'FOREIGN KEY',
              fields: ['queryVlsId'],
              name: 'FK_queryVlsId_Feedback', // useful if using queryInterface.removeConstraint
              references: {
                table: 'StudentQuery',
                field: 'queryVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('Feedback', {
              type: 'FOREIGN KEY',
              fields: ['learningLibraryVlsId'],
              name: 'FK_learningLibraryVlsId_Feedback', // useful if using queryInterface.removeConstraint
              references: {
                table: 'LearningLibrary',
                field: 'learningLibraryVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('Feedback', {
              type: 'FOREIGN KEY',
              fields: ['liveMeetingVlsId'],
              name: 'FK_liveMeetingVlsId_Feedback', // useful if using queryInterface.removeConstraint
              references: {
                table: 'LiveStreaming',
                field: 'liveStreamVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('Feedback', {
              type: 'FOREIGN KEY',
              fields: ['ticketVlsId'],
              name: 'FK_ticketVlsId_Feedback', // useful if using queryInterface.removeConstraint
              references: {
                table: 'Tickets',
                field: 'ticketVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('Feedback', {
              type: 'FOREIGN KEY',
              fields: ['studentVlsId'],
              name: 'FK_studentVlsId_Feedback', // useful if using queryInterface.removeConstraint
              references: {
                table: 'StudentSchoolPersonal',
                field: 'studentSchoolVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('Feedback', {
              type: 'FOREIGN KEY',
              fields: ['teacherVlsId'],
              name: 'FK_teacherVlsId_Feedback', // useful if using queryInterface.removeConstraint
              references: {
                table: 'facultyProfessional',
                field: 'facultyVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('Feedback', {
              type: 'FOREIGN KEY',
              fields: ['parentVlsId'],
              name: 'FK_parentVlsId_Feedback', // useful if using queryInterface.removeConstraint
              references: {
                table: 'Parent',
                field: 'parentVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('LearningLibrary', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_BranchVlsId_LearningLibrary', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('LearningLibrary', {
              type: 'FOREIGN KEY',
              fields: ['replyVlsId'],
              name: 'FK_replyVlsId_LearningLibrary', // useful if using queryInterface.removeConstraint
              references: {
                table: 'Feedback',
                field: 'replyVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('Assignment', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_Assignment', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('AssignmentQuestions', {
              type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_AssignmentQuestions', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
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
        }),
        queryInterface.addConstraint('Rewards', {
               type: 'FOREIGN KEY',
              fields: ['branchVlsId'],
              name: 'FK_branchVlsId_Rewards', // useful if using queryInterface.removeConstraint
              references: {
                table: 'BranchDetails',
                field: 'branchVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
        queryInterface.addConstraint('Rewards', {
               type: 'FOREIGN KEY',
              fields: ['studentVlsId'],
              name: 'FK_studentVlsId_Rewards', // useful if using queryInterface.removeConstraint
              references: {
                table: 'StudentSchoolPersonal',
                field: 'studentSchoolVlsId',
              },
              onDelete: 'no action',
              onUpdate: 'no action',
        }),
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
        queryInterface.sequelize.query('ALTER TABLE StudentSchoolPersonal DROP CONSTRAINT FK_ParentVlsId_Student;'),
        queryInterface.removeIndex('StudentSchoolPersonal', 'FK_ParentVlsId_Student')
      ])
  }
};
