const { validationResult } = require('express-validator');
const db = require("../models");
const Op = db.Sequelize.Op;
const LibraryHistory = db.LibraryHistory;
const LearningLibrary = db.LearningLibrary;
const VideoLearningLibrary = db.VideoLearningLibrary;

module.exports = {
  addHistory,
  viewHistory
};

/**
 * API for view history for learning library
 */
async function viewHistory(params, user){

  if(user.role != "student")  throw "Unauthorised User"
  if(!params.library_type)      throw "library_type is requeired"

  let library_type = params.library_type
  let include = null

  if(library_type == "Text"){
    include = [{ 
                      model:LearningLibrary,
                      as:'learningLibraryHistory'
                  }]
  }else{
    include = [{ 
                  model:VideoLearningLibrary,
                  as:'videoLearningLibraryHistory'
              }]
  }

  let libraryHistory = await LibraryHistory.findAll({
                        where: {
                          learning_library_type: library_type,
                        },
                        limit: 10,
                        order: [
                              ['last_visited_date', 'DESC']
                        ],
                        include: include
                      })

  return { success: true, message: "Library history data", data:libraryHistory }

};


/**
 * API for create/update history for learning library
 */
async function addHistory(body, user){

  if(user.role != "student")  throw "Unauthorised User"
  if(!body.library_type)      throw "library_type is requeired"
  if(!body.subject_code)      throw "subject_code is requeired"
  if(!body.visited_date) throw "visited_date is requeired"
  if(!body.library_vls_id)    throw "library_vls_id is requeired"
  if(!body.topic)             throw "topic is requeired"

  let librarydata = {
        learning_library_type     : body.library_type,
        subject_code              : body.subject_code,
        last_visited_date         : body.visited_date,
        Learning_library_vls_id   : body.library_vls_id,
        topic                     : body.topic,
        student_vls_id            : user.userVlsId
  }

  let libraryHistory = await checkLibraryData(librarydata)
  let message = ""

  if(libraryHistory){
    await updateLibraryData(librarydata)
    message = "Library history updated Succesfully"
  }else{
    await LibraryHistory.create(librarydata)
    message = "Library history created Succesfully"
  }

  libraryHistory = await checkLibraryData(librarydata)

  return { success: true, message: message, data:libraryHistory }

};

/**
 * function check history for learning library
 */
async function checkLibraryData(librarydata){

  let libraryHistory = await LibraryHistory.findOne({
                          where: {
                            Learning_library_vls_id : librarydata.Learning_library_vls_id,
                            learning_library_type   : librarydata.learning_library_type,
                            student_vls_id          : librarydata.student_vls_id
                          }
                        })

  return libraryHistory
};

/**
 * function update history for learning library
 */
async function updateLibraryData(librarydata){

  await LibraryHistory.update(librarydata,{
                          where: {
                            Learning_library_vls_id : librarydata.Learning_library_vls_id,
                            learning_library_type   : librarydata.learning_library_type,
                            student_vls_id          : librarydata.student_vls_id
                          }
                        })
};



