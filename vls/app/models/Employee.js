module.exports = (sequelize, Sequelize) => {
  const Employee = sequelize.define("employees", {
    faculty_vls_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      phone: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contact2: {
        type: Sequelize.STRING
      },
      email: {
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
      father_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      father_qualification: {
        type: Sequelize.STRING
      },
      mother_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      mother_qualification: {
        type: Sequelize.STRING
      },
      emergency_contact: {
        type: Sequelize.STRING
      },
      photo: {
        type: Sequelize.STRING
      },
      present_address: {
        type: Sequelize.STRING
      },
      hobbies: {
        type: Sequelize.STRING
      },
      hobbies: {
        type: Sequelize.STRING
      },
      access_permission: {
        type: Sequelize.STRING
      },
      spare1: {
        type: Sequelize.STRING
      },
      spare2: {
        type: Sequelize.STRING
      },
      spare3: {
        type: Sequelize.STRING
      },
      spare4: {
        type: Sequelize.STRING
      },
      spare5: {
        type: Sequelize.STRING
      },
      isPrincipal: {
        type: Sequelize.STRING
      },
      isAdmin: {
        type: Sequelize.STRING
      },
      isTeacher: {
        type: Sequelize.STRING
      },
      isOfficeStaff: {
        type: Sequelize.STRING
      },
      spare5: {
        type: Sequelize.STRING
      },
      spare5: {
        type: Sequelize.STRING
      },
      spare5: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      } 
  },{
    tableName: 'employees',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
  );
  

  return Employee;
};