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

module.exports = updateRewardsPoints;
