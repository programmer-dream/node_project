'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payment_settings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      school_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      branch_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      paypal_api_username: {
        type: Sequelize.STRING(100)
      },
      paypal_api_password: {
        type: Sequelize.STRING(100)
      },
      paypal_api_signature: {
        type: Sequelize.STRING(100)
      },
      paypal_email: {
        type: Sequelize.STRING(100)
      },
      paypal_demo: {
        type: Sequelize.TINYINT(1)
      },
      paypal_extra_charge: {
        type: Sequelize.FLOAT
      },
      paypal_status: {
        type: Sequelize.TINYINT(1)
      },
      stripe_secret: {
        type: Sequelize.STRING(100)
      },
      stripe_demo: {
        type: Sequelize.TINYINT(1)
      },
      stripe_extra_charge: {
        type: Sequelize.FLOAT
      },
      stripe_status: {
        type: Sequelize.TINYINT(1)
      },
      payumoney_key: {
        type: Sequelize.STRING(100)
      },
      payumoney_salt: {
        type: Sequelize.STRING(100)
      },
      payumoney_demo: {
        type: Sequelize.TINYINT(1)
      },
      payu_extra_charge: {
        type: Sequelize.FLOAT
      },
      payumoney_status: {
        type: Sequelize.TINYINT(1)
      },
      ccavenue_key: {
        type: Sequelize.STRING(100)
      },
      ccavenue_salt: {
        type: Sequelize.STRING(100)
      },
      ccavenue_demo: {
        type: Sequelize.TINYINT(1)
      },
      ccavenue_extra_charge: {
        type: Sequelize.FLOAT
      },
      ccavenue_status: {
        type: Sequelize.TINYINT(1)
      },
      paytm_merchant_key: {
        type: Sequelize.STRING(100)
      },
      paytm_merchant_mid: {
        type: Sequelize.STRING(100)
      },
      paytm_merchant_website: {
        type: Sequelize.TEXT
      },
      paytm_industry_type: {
        type: Sequelize.TEXT
      },
      paytm_demo: {
        type: Sequelize.TINYINT(1)
      },
      paytm_extra_charge: {
        type: Sequelize.FLOAT
      },
      paytm_status: {
        type: Sequelize.TINYINT(1)
      },
      stack_secret_key: {
        type: Sequelize.STRING(120)
      },
      stack_public_key: {
        type: Sequelize.STRING(120)
      },
      stack_demo: {
        type: Sequelize.TINYINT(1)
      },
      stack_extra_charge: {
        type: Sequelize.FLOAT
      },
      stack_status: {
        type: Sequelize.TINYINT(1)
      },
      status: {
        allowNull: false,
        type: Sequelize.TINYINT(1)
      },
      created_by: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      created_by_role: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      modified_by: {
        type: Sequelize.INTEGER
      },
      modified_by_role: {
        type: Sequelize.STRING(50)
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('payment_settings');
  }
};
