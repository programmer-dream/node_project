module.exports = (sequelize, Sequelize) => {
  const VlsRewards = sequelize.define("vls_rewards", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      create_query: {
        type: Sequelize.FLOAT,
        defaultValue:0
      },
      submit_offline_assignment: {
        type: Sequelize.FLOAT,
        defaultValue:0
      },
      submit_online_assignment: {
        type: Sequelize.FLOAT,
        defaultValue:0
      },
      watch_online_video: {
        type: Sequelize.FLOAT,
        defaultValue:0
      },
      view_learning_library: {
        type: Sequelize.FLOAT,
        defaultValue:0
      },
      create_support_ticket: {
        type: Sequelize.FLOAT,
        defaultValue:0
      },
      create_feedback : {
        type: Sequelize.FLOAT,
        defaultValue:0
      },
      chat_per_message: {
        type: Sequelize.FLOAT,
        defaultValue:0
      },
      community_per_message : {
        type: Sequelize.FLOAT,
        defaultValue:0
      },
      add_absence_remarks : {
        type: Sequelize.FLOAT,
        defaultValue:0
      },
      add_attendance : {
        type: Sequelize.FLOAT,
        defaultValue:0
      },
      add_offline_assignment :{
        type: Sequelize.FLOAT,
        defaultValue:0
      },
      add_online_assignment: {
        type: Sequelize.FLOAT,
        defaultValue:0
      },
      each_student_assessment : {
        type: Sequelize.FLOAT,
        defaultValue:0
      },
      min_point_redeemed:{
        type: Sequelize.FLOAT,
        defaultValue:0
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
  },{
    tableName: 'vls_rewards',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return VlsRewards;
};