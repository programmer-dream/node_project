module.exports = (sequelize, Sequelize) => {
  const Classes = sequelize.define("classes", {
    class_vls_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    branch_vls_id: {
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING(100)
    },
    teacher_id: {
      type: Sequelize.INTEGER
    },
    school_id: {
      type: Sequelize.INTEGER
    },
    numeric_name: {
      type: Sequelize.INTEGER
    },
    note: {
      type: Sequelize.TEXT
    },
    created_by: {
      type: Sequelize.INTEGER
    },
    modified_by: {
      type: Sequelize.INTEGER
    },
    status: {
      type: Sequelize.TINYINT
    }
  },{
    tableName: 'classes',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
  );

  
  return Classes;
};