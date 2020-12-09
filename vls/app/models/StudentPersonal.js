module.exports = (sequelize, Sequelize) => {
  const StudentPersonal = sequelize.define("StudentPersonal", {
      StudentPersonalId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      StudentVlsId: {
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
      Address: {
        type: Sequelize.STRING
      },
      Hobbies: {
        type: Sequelize.STRING
      },
      PassionVlsId: {
        type: Sequelize.STRING
      }
  },{
    tableName: 'StudentPersonal'
  }
  );

  return StudentPersonal;
};