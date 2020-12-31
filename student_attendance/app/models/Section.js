module.exports = (sequelize, Sequelize) => {
  const Section = sequelize.define("sections", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    branch_vls_id: {
      type: Sequelize.INTEGER
    },
    school_id: {
      type: Sequelize.INTEGER
    },
    class_id: {
      type: Sequelize.INTEGER
    },
    teacher_id: {
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING(100)
    },
    status: {
      type: Sequelize.TINYINT(1)
    },
    note: {
      type: Sequelize.TEXT
    },
    created_by: {
      type: Sequelize.INTEGER
    },
    modified_by: {
      type: Sequelize.INTEGER
    }
  },{
    tableName: 'sections',
    createdAt: 'created_at',
    updatedAt: 'modified_at'
  }
  );

  return Section;
};