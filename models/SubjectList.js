module.exports = (sequelize, Sequelize) => {
  const Subject = sequelize.define("subject_list", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subject_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      school_vls_id: {
        type: Sequelize.INTEGER,
      },
      branch_vls_id: {
        type: Sequelize.INTEGER,
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
      tableName: 'subject_list',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  
  return Subject;
};