module.exports = (sequelize, Sequelize) => {
  const StudentSchoolPersonal = sequelize.define("StudentSchoolPersonal", {
      StudentSchoolVlsId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      StudentVlsId: {
        type: Sequelize.INTEGER
      },
      BranchVlsId: {
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      middleName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      subject: {
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.STRING
      },
      contact1: {
        type: Sequelize.STRING
      },
      contact2: {
        type: Sequelize.STRING
      },
      emailId: {
        type: Sequelize.STRING
      },
      fatherName: {
        type: Sequelize.STRING
      },
      fatherQualification: {
        type: Sequelize.STRING
      },
      motherName: {
        type: Sequelize.STRING
      },
      motherQualification: {
        type: Sequelize.STRING
      },
      profilepic: {
        type: Sequelize.STRING
      },
      Address: {
        type: Sequelize.STRING
      },
      Hobbies: {
        type: Sequelize.STRING
      },
      ParentVlsId: {
        type: Sequelize.INTEGER
      },
      PassionVlsId: {
        type: Sequelize.INTEGER
      }
  },{
    tableName: 'StudentSchoolPersonal'
  }
  );

  return StudentSchoolPersonal;
};