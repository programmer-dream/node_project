module.exports = (sequelize, Sequelize) => {
  const Parent = sequelize.define("Parent", {
      ParentVlsId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      BranchVlsId: {
        //allowNull: false,
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
        type: Sequelize.DATE
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
      qualification1: {
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
      EmergencyContact: {
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
    tableName: 'Parent'
  }
  );

  return Parent;
};