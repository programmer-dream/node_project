module.exports = (sequelize, Sequelize) => {
  const Subject = sequelize.define("subjects", {
    subject_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      branch_vls_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      class_id: {
        type: Sequelize.INTEGER
      },
      teacher_id: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      }
  },{
      tableName: 'subjects',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  
  return Subject;
};