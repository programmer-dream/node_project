const db = require("../models");
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;
const Users   = db.Users;

async function updateRewardsPoints(user,points,type) {
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

async function getUserRewardsPoint(user) {
    let userPoint = await Users.findOne({ 
       where: { user_name: user.userId },
       attributes:['rewards_points']
    });

    return userPoint.rewards_points
}

async function updateReedeemPoint(user, points , resolved = false) {
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

module.exports = { updateRewardsPoints, getUserRewardsPoint, updateReedeemPoint };
