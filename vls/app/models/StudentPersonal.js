module.exports = (sequelize, Sequelize) => {
  const StudentPersonal = sequelize.define("StudentPersonal", {
      studentPersonalId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      studentVlsId: {
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
      dob: {
        type: Sequelize.STRING
      },
      contact1: {
        type: Sequelize.STRING
      },
      contact2: {
        type: Sequelize.STRING
      },
      email_id: {
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
      address: {
        type: Sequelize.STRING
      },
      hobbies: {
        type: Sequelize.STRING
      },
      passionVlsId: {
        type: Sequelize.STRING
      }
  },{
    tableName: 'StudentPersonal'
  }
  );

  return StudentPersonal;
};