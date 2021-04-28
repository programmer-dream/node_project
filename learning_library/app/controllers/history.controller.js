const { validationResult } = require('express-validator');
const db = require("../../../models");
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;
const LibraryHistory = db.LibraryHistory;
const LearningLibrary = db.LearningLibrary;
const VideoLearningLibrary = db.VideoLearningLibrary;
const Ratings = db.LibraryRatings;
const VideoRatings = db.VideoLibraryRatings;
const sequelize = db.sequelize;

module.exports = {
  addHistory,
  viewHistory
};

/**
 * API for view history for learning library
 */
async function viewHistory(params, user){
  if(user.role != "student")    throw "Unauthorised user"
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
                          learning_library_type : library_type,
                          student_vls_id        : user.userVlsId
                        },
                        limit: 10,
                        order: [
                              ['last_visited_date', 'DESC']
                        ],
                        include: include
                      })

  libraryHistory = await addRatingsAndLikesToHistory(libraryHistory, user)

  return { success: true, message: "Library history data", data:libraryHistory }

};



/**
 * get rating and likes for video learning library
 */
async function addRatingsAndLikesToHistory(libraryHistory, user) {
  await Promise.all(
    libraryHistory.map(async item => {
        if(item.learningLibraryHistory){
          let libHistory = item.learningLibraryHistory
          data = await getRatingLikes(libHistory.learning_library_vls_id, user)
          item.learningLibraryHistory.ratings = {
              like      : data.like,
              avg       : data.avg,
              user_data : data.data
            }
        }else{
          let libHistory = item.videoLearningLibraryHistory
          data = await getVideoRatingLikes(libHistory.video_learning_library_vls_id, user)
          item.videoLearningLibraryHistory.ratings = {
              like      : data.like,
              avg       : data.avg,
              user_data : data.data
            }

        }
    })
  )

  return libraryHistory

};


/**
 * get rating and likes for video learning library
 */
async function getVideoRatingLikes(id, user) {
  console.log(id, "invideo")
  try{
    let avg = 0
    let whereCondition = {}
    //get like count
    let like  = await VideoRatings.count({
      where:{likes:1,video_learning_library_vls_id:id}
    })

    //get rating avg
    let ratings = await VideoRatings.findOne({
      attributes: [ 
                    [ Sequelize.fn('SUM', Sequelize.col('ratings')), 'total_ratings' ],
                    [ Sequelize.fn('COUNT', Sequelize.col('ratings')), 'total_count' ]
                  ],
      where:{video_learning_library_vls_id:id},
      group:['video_learning_library_vls_id']
    })

    if(ratings){
    //get rating & likes
      let ratingData = ratings.toJSON();
        avg          = parseInt(ratingData.total_ratings) / ratingData.total_count
    }
      whereCondition.video_learning_library_vls_id = id

    if(user)
      whereCondition.user_vls_id = user.userVlsId

    userRating  = await VideoRatings.findOne({
      attributes : ['ratings','likes'],
      where : whereCondition
    })

    return { success:true, message:"Rating & like data",like:like,avg:avg,data:userRating}
    
  }catch(err){
    throw err.message;
  }
};


/**
 *  get rating and likes for library
 */
async function getRatingLikes(id, user) {
  try{
    let avg = 0
    let whereCondition = {}
    //get like count
    let like  = await Ratings.count({
      where:{likes:1,learning_library_vls_id:id}
    })

    //get rating avg
    let ratings = await Ratings.findOne({
      attributes: [
                    [ Sequelize.fn('SUM', Sequelize.col('ratings')), 'total_ratings' ],
                    [ Sequelize.fn('COUNT', Sequelize.col('ratings')), 'total_count' ]
                  ],
      where:{learning_library_vls_id:id},
      group:['learning_library_vls_id']
    })

    if(ratings){
    //get rating & likes
      let ratingData = ratings.toJSON();
        avg          = parseInt(ratingData.total_ratings) / ratingData.total_count
    } 
      whereCondition.learning_library_vls_id = id

    if(user)
      whereCondition.user_vls_id = user.userVlsId

    userRating  = await Ratings.findOne({
      attributes : ['ratings','likes'],
      where : whereCondition
    })

    return { success:true, message:"Rating & like data",like:like,avg:avg,data:userRating}

  }catch(err){
    throw err.message;
  }
};



/**
 * API for create/update history for learning library
 */
async function addHistory(body, user){

  if(user.role != "student")  throw "Unauthorised user"
  if(!body.library_type)      throw "library_type is requeired"
  if(!body.subject_code)      throw "subject_code is requeired"
  if(!body.visited_date)      throw "visited_date is requeired"
  if(!body.library_vls_id)    throw "library_vls_id is requeired"
  if(!body.topic)             throw "topic is requeired"
  if(!body.school_vls_id)     throw "school_vls_id is requeired"

  let librarydata = {
        learning_library_type     : body.library_type,
        subject_code              : body.subject_code,
        last_visited_date         : body.visited_date,
        Learning_library_vls_id   : body.library_vls_id,
        school_vls_id             : body.school_vls_id,
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



