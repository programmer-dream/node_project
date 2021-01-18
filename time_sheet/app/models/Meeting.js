module.exports = (sequelize, Sequelize) => {
  const Meeting = sequelize.define("meetings", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        school_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        branch_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        meeting_author_vls_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        originator_type: {
          allowNull: false,
          type: Sequelize.ENUM('principal')
        },
        attendee_vls_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        attendee_type: {
          allowNull: false,
          type: Sequelize.ENUM('parent','teacher')
        },
        attendee_status: {
          allowNull: false,
          type: Sequelize.STRING
        },
        attendee_remarks: {
          allowNull: false,
          type: Sequelize.STRING
        },
        meeting_title: {
          allowNull: false,
          type: Sequelize.STRING
        },
        meeting_description: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        meeting_mode: {
          allowNull: false,
          type: Sequelize.ENUM('online','f2f','voice_call')
        },
        meeting_location: {
          allowNull: false,
          type: Sequelize.STRING
        },
        date: {
          allowNull: false,
          type: Sequelize.DATE
        },
        time: {
          allowNull: false,
          type: Sequelize.STRING
        },
        duration: {
          allowNull: false,
          type: Sequelize.STRING
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        duration_type: {
          allowNull: false,
          type: Sequelize.ENUM('min','hour')
        }
  },{
      tableName: 'meetings',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  
  return Meeting;
};