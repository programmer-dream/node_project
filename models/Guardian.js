module.exports = (sequelize, Sequelize) => {
  const Guardian = sequelize.define("guardians", {
    parent_vls_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branch_vls_id: {
        type: Sequelize.INTEGER
      },
      school_vls_id: {
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.DATE
      },
      phone: {
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
      photo: {
        type: Sequelize.STRING
      },
      present_address: {
        type: Sequelize.STRING
      },
      hobbies: {
        type: Sequelize.STRING
      },
      emergency_contact: {
        type: Sequelize.STRING
      } 
  },{
    tableName: 'guardians',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
  );
  

  return Guardian;
};