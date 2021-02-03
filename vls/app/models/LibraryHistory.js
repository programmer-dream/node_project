module.exports = (sequelize, Sequelize) => {
  const LibraryHistory = sequelize.define("student_learning_library", {
    student_learning_library_vls_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    student_vls_id: {
      allowNull: false,
      type: Sequelize.BIGINT
    },
    learning_library_type: {
      type: Sequelize.ENUM('Video','Text')
    },
    subject: {
      type: Sequelize.STRING
    },
    topic: {
      type: Sequelize.STRING
    },
    time_spent: {
      type: Sequelize.STRING
    },
    Learning_library_vls_id: {
      type: Sequelize.INTEGER
    },
    last_visited_date: {
      type: Sequelize.STRING
    },
    subject_code: {
      type: Sequelize.STRING
    }
  },{
    tableName: 'student_learning_library',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
  );

  
  return LibraryHistory;
};