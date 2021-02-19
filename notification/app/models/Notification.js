module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define("notification", {
      notification_vls_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        type: Sequelize.INTEGER
      },
      school_vls_id: {
        type: Sequelize.INTEGER
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      event_type: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('general','important','critical'),
        allowNull: false,
      },
      notificaton_type: {
        type: Sequelize.ENUM('assignment','meeting','query','community','exam'),
        allowNull: false
      },
      notificaton_type_id : {
        type: Sequelize.INTEGER
      },
      users:{
        type: Sequelize.TEXT('long')
      },
      added_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      added_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      close_date: {
        type: Sequelize.DATE
      },
      class_id: {
        type: Sequelize.INTEGER
      },
      section_id: {
        type: Sequelize.INTEGER
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
        tableName: 'notification',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
  );
  
  return Notification;
};