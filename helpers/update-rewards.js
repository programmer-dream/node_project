const db = require("../models");
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;
const Users   = db.Users;
const School = db.SchoolDetails;
const Branch = db.Branch;
const VlsRewards   = db.VlsRewards;


/**
 * API for update reward point
 */
async function updateRewardsPoints(user,pointType,type) {
    let isEnabled = await isSettingEnabled(user)

    if(isEnabled == 'no') return true

    let vlsPoints = await VlsRewards.findOne()

    let points = vlsPoints[pointType]

    let pointsUpdate = ""
    if(type == "increment"){
        pointsUpdate = Sequelize.literal("rewards_points + "+points)
    }else if(type == "decrement"){
        pointsUpdate = Sequelize.literal("rewards_points - "+points)
    }

    

    await Users.update({ 
      rewards_points: pointsUpdate }, 
      { where: { user_name: user.userId }
    });

}


/**
 * API for get user reward point
 */
async function getUserRewardsPoint(user) {
    let userPoint = await Users.findOne({ 
       where: { user_name: user.userId },
       attributes:['rewards_points']
    });

    return userPoint.rewards_points
}


/**
 * API for settled redeem points
 */
async function updateReedeemPoint(user, points , resolved = false) {
  let isEnabled = await isSettingEnabled(user)

  if(isEnabled == 'no') return true

  if(!resolved){
      let pointsDecrement = Sequelize.literal("rewards_points - "+points)
      let pointsIncrement = Sequelize.literal("rewards_request + "+points)

      await Users.update({ 
        rewards_points  : pointsDecrement,
        rewards_request : pointsIncrement,
        }, 
        { where: { user_name: user.userId }
      });
  }else{
      let pointsDecrement = Sequelize.literal("rewards_request - "+points)
      let pointsIncrement = Sequelize.literal("point_redeemed + "+points)

      await Users.update({ 
        rewards_request  : pointsDecrement,
        point_redeemed   : pointsIncrement,
        }, 
        { where: { user_name: user.userId }
      });
  }
}


/**
 * API for is setting enabled redeem points
 */
async function isSettingEnabled(user){

    let dbUser = await Users.findOne({ 
       where: { user_name: user.userId },
       attributes : ['school_id','branch_vls_id']
    });

    let dbSchool = await School.findOne({ 
       where: { school_id: dbUser.school_id },
       attributes : ['rewards_and_recognition_support']
    });

    let dbBranch = await Branch.findOne({ 
       where: { branch_vls_id: dbUser.branch_vls_id },
       attributes : ['rewards_and_recognition_support']
    });
    
    if(dbSchool && dbBranch){
      if(dbSchool.rewards_and_recognition_support == 'yes' && dbBranch.rewards_and_recognition_support == 'yes')
          return 'yes'
    }
    return 'no'
}

module.exports = { updateRewardsPoints, getUserRewardsPoint, updateReedeemPoint };
