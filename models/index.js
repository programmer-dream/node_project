const dbConfig = require("../config/database.js");
const env = require("../config/env.js");

const envMode = env.environmnet

let DB
let user
let password
let host
let dialect
let poolMax
let poolMin
let poolAcquire
let poolIdle
let dialectOptions

if(envMode == "production"){
	DB = dbConfig.production.database
	user = dbConfig.production.username
	passowrd = dbConfig.production.password
	host = dbConfig.production.host
	dialect = dbConfig.production.dialect
	dialectOptions = dbConfig.production.dialectOptions
	poolMax = dbConfig.production.pool.max
	poolMin = dbConfig.production.pool.min
	poolAcquire = dbConfig.production.pool.acquire
	poolIdle = dbConfig.production.pool.idle
}else{
	DB = dbConfig.development.database
	user = dbConfig.development.username
	passowrd = dbConfig.development.password
	host = dbConfig.development.host
	dialect = dbConfig.development.dialect
	dialectOptions = dbConfig.development.dialectOptions
	poolMax = dbConfig.development.pool.max
	poolMin = dbConfig.development.pool.min
	poolAcquire = dbConfig.development.pool.acquire
	poolIdle = dbConfig.development.pool.idle
}

const Sequelize = require("sequelize");
const sequelize = new Sequelize(DB, user, passowrd, {
  host: host,
  dialect: dialect,
  dialectOptions:dialectOptions,
  pool: {
    max: poolMax,
    min: poolMin,
    acquire: poolAcquire,
    idle: poolIdle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

sequelize.authenticate()
	.then(function(err) {
 		console.log('Connection has been established successfully.');
	}, function (err) {
 		console.log('Unable to connect to the database:', err);
	}
);

/*********** vls management ***********/
db.Authentication = require("./Authentication.js")(sequelize, Sequelize);
db.SchoolDetails = require("./School.js")(sequelize, Sequelize);
db.Role = require("./Role.js")(sequelize, Sequelize);
db.Student = require("./Student.js")(sequelize, Sequelize);
db.Guardian = require("./Guardian.js")(sequelize, Sequelize);
db.Employee = require("./Employee.js")(sequelize, Sequelize);
db.Branch = require("./Branch.js")(sequelize, Sequelize);
db.UserSetting = require("./UserSetting.js")(sequelize, Sequelize);
db.LibraryHistory = require("./LibraryHistory.js")(sequelize, Sequelize);
db.Users = require("./Authentication.js")(sequelize, Sequelize);
db.SchoolMeetingSettings = require("./SchoolMeetingSettings.js")(sequelize, Sequelize);
db.VlsVideoServices = require("./VlsVideoServices.js")(sequelize, Sequelize);

/*********** query management ***********/
db.StudentQuery = require("./StudentQuery.js")(sequelize, Sequelize);
db.Comment = require("./Comment.js")(sequelize, Sequelize);
db.Ratings = require("./Ratings.js")(sequelize, Sequelize);
db.Subject = require("./Subject.js")(sequelize, Sequelize);
db.SubjectList = require("./SubjectList.js")(sequelize, Sequelize);

/*********** student attendance management ***********/
db.StudentAttendance = require("./StudentAttendance.js")(sequelize, Sequelize);
db.Classes = require("./Classes.js")(sequelize, Sequelize);
db.Section = require("./Section.js")(sequelize, Sequelize);
db.AcademicYear = require("./AcademicYear.js")(sequelize, Sequelize);
db.StudentAbsent = require("./StudentAbsent.js")(sequelize, Sequelize);

/*********** assignment management ***********/
db.Assignment = require("./Assignment.js")(sequelize, Sequelize);
db.StudentAssignment = require("./StudentAssignment.js")(sequelize, Sequelize);
db.AssignmentQuestions = require("./AssignmentQuestions.js")(sequelize, Sequelize);
db.StudentAssignmentResponse = require("./StudentAssignmentResponse.js")(sequelize, Sequelize);

/*********** chat management ***********/
db.Chat = require("./Chat.js")(sequelize, Sequelize);

/*********** timesheet management ***********/
db.Routine = require("./Routine.js")(sequelize, Sequelize);
db.Meeting = require("./Meeting.js")(sequelize, Sequelize);
db.ExamSchedule = require("./ExamSchedule.js")(sequelize, Sequelize);
db.Exam = require("./Exam.js")(sequelize, Sequelize);

/*********** feedback management ***********/
db.Feedback = require("./Feedback.js")(sequelize, Sequelize);

/*********** notifications management ***********/
db.Notification = require("./Notification.js")(sequelize, Sequelize);
db.NotificationReadBy = require("./NotificationReadBy.js")(sequelize, Sequelize);

/*********** reports management ***********/
db.Exams = require("./Exams.js")(sequelize, Sequelize);
db.Marks = require("./Marks.js")(sequelize, Sequelize);

/*********** ticket management ***********/
db.Ticket = require("./Ticket.js")(sequelize, Sequelize);
db.TicketComment = require("./TicketComment.js")(sequelize, Sequelize);
db.TicketRating = require("./TicketRating.js")(sequelize, Sequelize);

/*********** community management ***********/
db.CommunityChat = require("./CommunityChat.js")(sequelize, Sequelize);
db.CommunityCommunication = require("./CommunityCommunication.js")(sequelize, Sequelize);
db.CommunityRatingLike = require("./CommunityRatingLike.js")(sequelize, Sequelize);

/*********** learning library management ***********/
db.LearningLibrary = require("./LearningLibrary.js")(sequelize, Sequelize);
db.LibraryRatings = require("./LibraryRatings.js")(sequelize, Sequelize);
db.LibraryComment = require("./LibraryComment.js")(sequelize, Sequelize);

/*********** video learning library management ***********/
db.VideoLearningLibrary = require("./VideoLearningLibrary.js")(sequelize, Sequelize);
db.VideoLibraryRatings = require("./VideoLibraryRatings.js")(sequelize, Sequelize);
db.VideoLibraryComment = require("./VideoLibraryComment.js")(sequelize, Sequelize);


/*********** vls rewards management ***********/
db.VlsRewards = require("./VlsRewards.js")(sequelize, Sequelize);

/*********** vls passion and interest management ***********/
db.PassionInterest = require("./PassionInterest.js")(sequelize, Sequelize);
db.PassionComment = require("./PassionComments.js")(sequelize, Sequelize);
db.PassionAcceptedBy = require("./PassionAcceptedBy.js")(sequelize, Sequelize);

/*********** Relation management between tables ***********/

/*********** vls management ***********/
db.Authentication.belongsTo(db.Role,{foreignKey:'role_id',as:'roles'})
db.Authentication.belongsTo(db.SchoolDetails,{foreignKey:'school_id',as:'school'})
db.Authentication.belongsTo(db.Branch,{foreignKey:'branch_vls_id',as:'branch'})
db.Authentication.belongsTo(db.UserSetting,{foreignKey:'user_settings_vls_id',as:'userSetting'})
db.Employee.belongsTo(db.Branch,{foreignKey:'branch_vls_id',as:'branchDetails'})
db.Guardian.belongsTo(db.Branch,{foreignKey:'branch_vls_id',as:'branchDetailsGuardian'})
db.Student.belongsTo(db.Branch,{foreignKey:'branch_vls_id',as:'branchDetailsStudent'})
db.Branch.belongsTo(db.SchoolDetails,{foreignKey:'school_vls_id',as:'schoolDetails'})
db.SchoolDetails.hasMany(db.Branch,{foreignKey:'school_id',as:'branch'})
db.Branch.hasMany(db.Users,{foreignKey:'branch_vls_id',as:'users'})
/*********** query management ***********/
db.StudentQuery.belongsTo(db.Student,{foreignKey:'student_vls_id',as:'postedBy'})
db.StudentQuery.belongsTo(db.Employee,{foreignKey:'faculty_vls_id',as:'respondedBy'})
db.Ratings.belongsTo(db.Student,{foreignKey:'user_vls_id',as:'ratingBy'})
db.Ratings.belongsTo(db.Student,{foreignKey:'user_vls_id',as:'likeBy'})
db.Branch.hasMany(db.Subject,{foreignKey:'branch_vls_id',as:'subject'})
db.StudentQuery.belongsTo(db.SubjectList,{foreignKey:'subject_code',targetKey:'code',as:'subjectList'})
db.StudentQuery.belongsTo(db.Subject,{foreignKey:'subject_code',targetKey:'code',as:'subject'})
db.StudentQuery.belongsTo(db.Classes,{foreignKey:'class_vls_id',as:'class'})
db.StudentQuery.belongsTo(db.Employee,{foreignKey:'faculty_vls_id',as:'faculty'})
db.Branch.hasMany(db.SubjectList,{foreignKey:'branch_vls_id',as:'subjectList'})
db.StudentQuery.hasMany(db.Ratings,{foreignKey:'query_vls_id',as:'ratingLikes'})

/*********** student attendance management ***********/
db.Classes.hasMany(db.Section,{foreignKey:'class_id',as:'sections'})
db.StudentAttendance.belongsTo(db.Student,{foreignKey:'student_id',as:'student'})
db.StudentAttendance.belongsTo(db.SubjectList,{foreignKey:'subject_code',targetKey:'code',as:'subject'})
db.Student.belongsTo(db.Guardian,{foreignKey:'parent_vls_id',as:'parent'})
db.Student.belongsTo(db.Section,{foreignKey:'section_id',as:'section'})
db.Student.belongsTo(db.Classes,{foreignKey:'class_id',as:'classes'})
db.Student.belongsTo(db.SchoolDetails,{foreignKey:'school_id',as:'school'})
db.Branch.belongsTo(db.SchoolDetails,{foreignKey:'school_vls_id',as:'school'})
db.Classes.belongsTo(db.Employee,{foreignKey:'teacher_id',as:'class_teacher'})
db.Employee.hasMany(db.Classes,{foreignKey:'teacher_id',as:'teacher_class'})
db.Employee.hasMany(db.Section,{foreignKey:'teacher_id',as:'teacher_section'})
db.Employee.hasOne(db.Subject,{foreignKey:'teacher_id',as:'teacher_subject'})

/*********** assignment management ***********/
db.Assignment.belongsTo(db.Employee,{foreignKey:'added_by',as:'addedBY'})
db.Assignment.belongsTo(db.Classes,{foreignKey:'assignment_class_id',as:'class'})
db.Assignment.belongsTo(db.Section,{foreignKey:'section_id',as:'section'})
db.Assignment.belongsTo(db.SubjectList,{foreignKey:'subject_code',targetKey:'code',as:'subjectList'})
db.Assignment.hasMany(db.StudentAssignment,{foreignKey:'assignment_vls_id',as:'studentAssignment'})
db.Assignment.hasMany(db.AssignmentQuestions,{foreignKey:'assignment_vls_id',as:'assignmentQuestion'})
db.StudentAssignment.hasMany(db.AssignmentQuestions,{foreignKey:'assignment_vls_id', sourceKey:'assignment_vls_id', as:'assignmentQuestionResponse'})
db.AssignmentQuestions.hasOne(db.StudentAssignmentResponse,{foreignKey:'question_id',as:'questionResponse'})

/********** chat management **********/
db.Employee.hasMany(db.Subject,{foreignKey:'teacher_id',as:'subject'})

/*********** timesheet management ***********/
db.Routine.belongsTo(db.SubjectList,{foreignKey:'subject_code',targetKey:'code',as:'subjectList'})

db.ExamSchedule.belongsTo(db.SubjectList,{foreignKey:'subject_code',targetKey:'code',as:'subject'})
db.Routine.belongsTo(db.Employee,{foreignKey:'teacher_id',as:'teacher'})
db.Exams.hasMany(db.ExamSchedule,{foreignKey:'exam_vls_id',as:'schedule'})
db.ExamSchedule.belongsTo(db.Exam,{foreignKey:'exam_vls_id', as:'exam'})
db.Meeting.belongsTo(db.Employee,{foreignKey:'meeting_author_vls_id',as:'addedBy'})
db.Assignment.belongsTo(db.SubjectList,{foreignKey:'subject_code',targetKey:'code',as:'subject'})

/*********** feedback management ***********/
db.Feedback.belongsTo(db.Meeting,{foreignKey:'meeting_vls_id',as:'meetingData'})
db.Meeting.belongsTo(db.Employee,{foreignKey:'meeting_author_vls_id',as:'meetingUser'})

/*********** notifications management ***********/
db.Notification.belongsTo(db.NotificationReadBy,{foreignKey:'notification_vls_id',as:'readBy'})

/*********** reports management ***********/
db.Exams.hasMany(db.Marks,{foreignKey:'exam_id',as:'marks'})
db.Marks.belongsTo(db.SubjectList,{foreignKey:'subject_code',targetKey : 'code', as:'subject'})
//
db.SubjectList.hasMany(db.Marks,{foreignKey:'subject_code',targetKey : 'code', as:'test'})

db.Marks.belongsTo(db.Student,{foreignKey:'student_id', as:'student'})
db.Student.belongsTo(db.Guardian,{foreignKey:'parent_vls_id', as:'guardian'})
db.Student.hasMany(db.Marks,{foreignKey:'student_id', as:'marks'})
db.Student.hasMany(db.StudentAttendance,{foreignKey:'student_id', as:'attendance'})
db.Marks.belongsTo(db.Exams,{foreignKey:'exam_id', as:'exam'})
db.Classes.hasMany(db.Marks,{foreignKey:'class_id', as:'marks'})
db.Classes.hasMany(db.Section,{foreignKey:'class_id', as:'section'})
db.Marks.belongsTo(db.Classes,{foreignKey:'class_id', as:'classes'})
db.Marks.belongsTo(db.Section,{foreignKey:'section_id', as:'section'})
db.Guardian.hasMany(db.Student,{foreignKey:'parent_vls_id', as:'children'})

/*********** school management ***********/
db.Authentication.belongsTo(db.Employee,{foreignKey:'user_vls_id',as:'employee'})

/*********** learning library management ***********/
db.LearningLibrary.belongsTo(db.SubjectList,{foreignKey:'subject_code',targetKey:'code',as:'subjectList'})
db.LibraryHistory.belongsTo(db.LearningLibrary,{foreignKey:'Learning_library_vls_id', as:'learningLibraryHistory'})
db.LibraryHistory.belongsTo(db.VideoLearningLibrary,{foreignKey:'Learning_library_vls_id', as:'videoLearningLibraryHistory'})
/*********** video learning library management ***********/
db.VideoLearningLibrary.belongsTo(db.SubjectList,{foreignKey:'subject_code',targetKey:'code',as:'subjectList'})

module.exports = db;

