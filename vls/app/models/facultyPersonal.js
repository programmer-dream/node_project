module.exports = (sequelize, Sequelize) => {
  const facultyPersonal = sequelize.define("facultyPersonal", {
      facultyVlsId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      BranchVlsId: {
        type: Sequelize.INTEGER
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      middleName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      dob: {
        allowNull: false,
        type: Sequelize.STRING
      },
      sex: {
        type: Sequelize.STRING
      },
      contact1: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contact2: {
        type: Sequelize.STRING
      },
      emailId: {
        type: Sequelize.STRING
      },
      qualification1: {
        type: Sequelize.STRING
      },
      Degree1: {
        type: Sequelize.STRING
      },
      University1: {
        type: Sequelize.STRING
      },
      Year1: {
        type: Sequelize.STRING
      },
      Degree2: {
        type: Sequelize.STRING
      },
      University2: {
        type: Sequelize.STRING
      },
      Year2: {
        type: Sequelize.STRING
      },
      Degree3: {
        type: Sequelize.STRING
      },
      University3: {
        type: Sequelize.STRING
      },
      Year3: {
        type: Sequelize.STRING
      },
      fatherName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      fatherQualification: {
        type: Sequelize.STRING
      },
      motherName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      motherQualification: {
        type: Sequelize.STRING
      },
      EmergencyContact: {
        type: Sequelize.STRING
      },
      profilepic: {
        type: Sequelize.STRING
      },
      motherQualification: {
        type: Sequelize.STRING
      },
      Hobbies: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
  },{
    tableName: 'facultyPersonal'
  }
  );

  return facultyPersonal;
};