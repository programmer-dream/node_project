module.exports = (sequelize, Sequelize) => {
  const PassionAcceptedBy = sequelize.define("passion_accepted_by", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      school_vls_id: {
        type: Sequelize.INTEGER
      },
      passion_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      user_vls_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      user_type: {
        type: Sequelize.STRING,
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
      tableName: 'passion_accepted_by',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  
  return PassionAcceptedBy;
};