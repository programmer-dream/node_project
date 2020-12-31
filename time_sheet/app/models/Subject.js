module.exports = (sequelize, Sequelize) => {
  const Subject = sequelize.define("subjects", {
    subject_vls_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        type: Sequelize.INTEGER
      },
      class_id: {
        type: Sequelize.INTEGER
      },
      teacher_id: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.INTEGER
      }
  },{
      tableName: 'subjects',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  
  return Subject;
};