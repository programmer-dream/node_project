module.exports = (sequelize, Sequelize) => {
  const Ticket = sequelize.define("tickets", {
    ticket_vls_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      school_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      subject: {
        type: Sequelize.STRING
      },
      open_date: {
        type: Sequelize.DATE
      },
      response: {
        type: Sequelize.STRING
      },
      attachment: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      user_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ticket_priorty: {
        type: Sequelize.ENUM('minor', 'medium', 'critical'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('new', 'assigned', 'wip', 'resolved'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('application', 'infrastructure'),
        allowNull: false
      },
      assigned_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      assigned_user_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ticket_text: {
        type: Sequelize.TEXT('long'),
        allowNull: false
      }
  },{
    tableName: 'tickets',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return Ticket;
};