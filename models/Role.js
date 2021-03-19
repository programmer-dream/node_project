module.exports = (sequelize, Sequelize) => {
  const Roles = sequelize.define("roles", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      slug: {
        allowNull: false,
        type: Sequelize.STRING
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      note: {
        type: Sequelize.STRING
      },
      is_default: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      is_super_admin: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      status: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      }
  },{
    tableName: 'roles',
    createdAt: 'created_at',
    updatedAt: 'modified_at'
  }
  );
  

  return Roles;
};