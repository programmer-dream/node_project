module.exports = (sequelize, Sequelize) => {
  const Ticket = sequelize.define("ticket_rating", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ratings: {
        type: Sequelize.INTEGER
      },
      user_vls_id: {
        type: Sequelize.BIGINT
      },
      user_type: {
        type: Sequelize.STRING
      },
      ticket_vls_id: {
        type: Sequelize.INTEGER
      },
      school_vls_id: {
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
    tableName: 'ticket_rating',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return Ticket;
};