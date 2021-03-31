module.exports = (sequelize, Sequelize) => {
  const NotificationReadBy = sequelize.define("notification_read_by", {
      notification_vls_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      user_type: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      school_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },
    {
      tableName: 'notification_read_by',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  
  return NotificationReadBy;
};