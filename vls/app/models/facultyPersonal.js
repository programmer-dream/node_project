module.exports = (sequelize, Sequelize) => {
  const facultyPersonal = sequelize.define("facultyPersonal", {
      facultyVlsId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      branchVlsId: {
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
      degree1: {
        type: Sequelize.STRING
      },
      university1: {
        type: Sequelize.STRING
      },
      year1: {
        type: Sequelize.STRING
      },
      degree2: {
        type: Sequelize.STRING
      },
      university2: {
        type: Sequelize.STRING
      },
      year2: {
        type: Sequelize.STRING
      },
      degree3: {
        type: Sequelize.STRING
      },
      university3: {
        type: Sequelize.STRING
      },
      year3: {
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
      emergencyContact: {
        type: Sequelize.STRING
      },
      profilepic: {
        type: Sequelize.STRING
      },
      motherQualification: {
        type: Sequelize.STRING
      },
      hobbies: {
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