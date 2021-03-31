module.exports = (sequelize, Sequelize) => {
  const PassionInterest = sequelize.define("passion_and_interests", {
      passion_vls_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      passion_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT('long'),
        allowNull: false
      },
      passion_type: {
        type: Sequelize.STRING
      },
      is_comment: {
        type: Sequelize.TINYINT(1),
        defaultValue:0
      },
      status: {
        type: Sequelize.TINYINT(1),
        defaultValue:0
      },
      added_by: {
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
      tableName: 'passion_and_interests',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  
  return PassionInterest;
};