module.exports = (sequelize, Sequelize) => {
  const ServiceProvider = sequelize.define("vls_service_provider", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      } 
  },{
    tableName: 'vls_service_provider',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
  );
  

  return ServiceProvider;
};