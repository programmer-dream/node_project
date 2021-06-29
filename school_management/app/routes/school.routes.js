const express = require('express'); 
const router = express.Router()
const schoolController = require("../controllers/school.controller");
const { check } = require('express-validator');
const helper = require("../helper");
const upload  = helper.upload;
//Post
router.post("/create",[
    upload.fields([{
        name:'logo',maxCount:1
    }]),
    check('school_name','school_name field is required.').not().isEmpty(),
    check('description','description field is required.').not().isEmpty(),
    check('address','address field is required.').not().isEmpty(),
    check('phone','phone field is required.').not().isEmpty(),
    check('email','email field is required.').not().isEmpty(),
    ],createSchool);
//Post
router.post("/branch/create",[
    check('branch_name','branch_name field is required.').not().isEmpty(),
    check('address','address field is required.').not().isEmpty(),
    check('contact1','contact1 field is required.').not().isEmpty(),
    check('emailId1','emailId1 field is required.').not().isEmpty(),
    check('school_id','school_id field is required.').not().isEmpty(),
    ],createBranch);

router.post("/createUser",[
    upload.fields([{
        name:'photo',maxCount:1
    }]),
    check('name','name field is required.').not().isEmpty(),
    check('phone','phone field is required.').not().isEmpty(),
    check('email','email field is required.').not().isEmpty(),
    check('present_address','present_address field is required.').not().isEmpty(),
    check('type','type field is required.').not().isEmpty(),
    check('school_id','school_id field is required.').not().isEmpty(),
    check('password','password field is required.').not().isEmpty()
    ],createUser);

//school meeting settings
router.post("/schoolMeetingSettings",schoolMeetingSettings);

router.put("/updateUser/:id",[
    upload.fields([{
        name:'photo',maxCount:1
    }])
    ],updateUser);

//GET
router.get("/view/:id",viewSchool);
router.get("/viewUser/:id",viewUser);
router.get("/branch/view/:id",viewBranch);
router.get("/list/",listSchool);
router.get("/AllList/",AllList);
router.get("/allBranches",allBranches);
router.get("/:id/branchList/",listBranch);
router.get("/appUsage",appUsage);

router.get("/listStudents/",listStudents);
router.get("/listTeachers/",listTeachers);
router.get("/listParents/",listParents);
router.get("/viewStudent/:id",viewStudent);
router.get("/viewTeacher/:id",viewTeacher);
router.get("/viewParent/:id",viewParent);

//put
router.put("/update/:id",updateSchool);
router.put("/branch/update/:id",updateBranch);
router.put("/:id/updateSettings/",updateSchoolSettings);
router.put("/branch/:id/updateSettings/",updateBranchSettings);

//delete
router.delete("/delete/:id",deleteSchool);
router.delete("/branch/delete/:id",deleteBranch);
router.delete("/deleteUser/:id",deleteUser);

module.exports = router;

// Function for create school
function createSchool(req, res, next) {
    schoolController.create(req)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while creating school' }))
        .catch(err => next(err));
}

// Function for view school
function viewSchool(req, res, next) {
    schoolController.view(req.params.id)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while viewing school' }))
        .catch(err => next(err));
}

// Function for view school
function viewUser(req, res, next) {
    schoolController.viewUser(req.params.id)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while viewing school' }))
        .catch(err => next(err));
}

// Function for view branch
function viewBranch(req, res, next) {
    schoolController.viewBranch(req.params.id)
        .then(branch => branch ? res.json(branch) : res.status(400).json({ status: "error", message: 'Error while viewing branch' }))
        .catch(err => next(err));
}

// Function for list school
function listSchool(req, res, next) {
    schoolController.list(req.query , req.user)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while viewing school' }))
        .catch(err => next(err));
}

// Function for list branch
function listBranch(req, res, next) {
    schoolController.listBranch(req.params.id, req.user, req.query)
        .then(branch => branch ? res.json(branch) : res.status(400).json({ status: "error", message: 'Error while viewing branch' }))
        .catch(err => next(err));
}

// Function for update school
function updateSchool(req, res, next) {
    schoolController.update(req , req.params.id)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while updating school' }))
        .catch(err => next(err));
}

// Function for update branch
function updateBranch(req, res, next) {
    schoolController.updateBranch(req , req.params.id)
        .then(branch => branch ? res.json(branch) : res.status(400).json({ status: "error", message: 'Error while updating branch' }))
        .catch(err => next(err));
}

// Function for delete school
function deleteSchool(req, res, next) {
    schoolController.deleteSchool(req.params.id)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while deleting school' }))
        .catch(err => next(err));
}

// Function for delete branch
function deleteBranch(req, res, next) {
    schoolController.deleteBranch(req.params.id)
        .then(branch => branch ? res.json(branch) : res.status(400).json({ status: "error", message: 'Error while deleting school' }))
        .catch(err => next(err));
}

// Function for setting school
function updateSchoolSettings(req, res, next) {
    schoolController.schoolSettingUpdate(req.params.id, req.body)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while updating school settings' }))
        .catch(err => next(err));
}

// Function for setting branch
function updateBranchSettings(req, res, next) {
    schoolController.updateBranchSettings(req.params.id, req.body)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while updating school settings' }))
        .catch(err => next(err));
}

// Function for create school
function createBranch(req, res, next) {
    schoolController.createBranch(req)
        .then(branch => branch ? res.json(branch) : res.status(400).json({ status: "error", message: 'Error while creating branch' }))
        .catch(err => next(err));
}

// Function for create user
function createUser(req, res, next) {
    schoolController.createUser(req)
        .then(user => user ? res.json(user) : res.status(400).json({ status: "error", message: 'Error while creating user' }))
        .catch(err => next(err));
}

// Function for create user
function updateUser(req, res, next) {
    schoolController.updateUser(req.params.id, req)
        .then(user => user ? res.json(user) : res.status(400).json({ status: "error", message: 'Error while creating user' }))
        .catch(err => next(err));
}

// Function for delete user
function deleteUser(req, res, next) {
    schoolController.deleteUser(req.params.id)
        .then(branch => branch ? res.json(branch) : res.status(400).json({ status: "error", message: 'Error while deleting school' }))
        .catch(err => next(err));
}

// Function for list students
function listStudents(req, res, next) {
    schoolController.listStudents(req.query, req.user )
        .then(branch => branch ? res.json(branch) : res.status(400).json({ status: "error", message: 'Error while listing students' }))
        .catch(err => next(err));
}

// Function for list teachers
function listTeachers(req, res, next) {
    schoolController.listTeachers(req.query, req.user)
        .then(branch => branch ? res.json(branch) : res.status(400).json({ status: "error", message: 'Error while listing teachers' }))
        .catch(err => next(err));
}

// Function for list parents
function listParents(req, res, next) {
    schoolController.listParents(req.query, req.user)
        .then(branch => branch ? res.json(branch) : res.status(400).json({ status: "error", message: 'Error while listing parents' }))
        .catch(err => next(err));
}

// Function for view student
function viewStudent(req, res, next) {
    schoolController.viewStudent(req.params.id, req.user)
        .then(student => student ? res.json(student) : res.status(400).json({ status: "error", message: 'Error while view student' }))
        .catch(err => next(err));
}

// Function for view teacher
function viewTeacher(req, res, next) {
    schoolController.viewTeacher(req.params.id, req.user)
        .then(teacher => teacher ? res.json(teacher) : res.status(400).json({ status: "error", message: 'Error while view teacher' }))
        .catch(err => next(err));
}

// Function for view parent
function viewParent(req, res, next) {
    schoolController.viewParent(req.params.id, req.user)
        .then(parent => parent ? res.json(parent) : res.status(400).json({ status: "error", message: 'Error while view parent' }))
        .catch(err => next(err));
}

// Function for dashboard count
function AllList(req, res, next) {
    schoolController.AllList(req.query, req.user)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while getting school list' }))
        .catch(err => next(err));
}

// Function for dashboard count
function allBranches(req, res, next) {
    schoolController.allBranches(req.query, req.user)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while getting school list' }))
        .catch(err => next(err));
}

// Function for app app usage 
function appUsage(req, res, next) {
    schoolController.AllAppUsage(req.query, req.user)
        .then(school => school ? res.json(school) : res.status(400).json({ status: "error", message: 'Error while getting app usage' }))
        .catch(err => next(err));
}

// Function school meeting settings
function schoolMeetingSettings(req, res, next) {
    schoolController.schoolMeetingSettings(req.body, req.user)
        .then(setting => setting ? res.json(setting) : res.status(400).json({ status: "error", message: 'Error while school meeting settings' }))
        .catch(err => next(err));
}
