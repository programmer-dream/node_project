'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
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
          type: Sequelize.STRING(50)
        },
        paypal_demo: {
          type: Sequelize.BOOLEAN
        },
        paypal_extra_charge: {
          type: Sequelize.DECIMAL(10,2)
        },
        paypal_status: {
          type: Sequelize.BOOLEAN
        },
        stripe_secret: {
          type: Sequelize.STRING(100)
        },
        stripe_demo: {
          type: Sequelize.BOOLEAN
        },
        stripe_extra_charge: {
          type: Sequelize.DECIMAL(10,2)
        },
        stripe_status: {
          type: Sequelize.BOOLEAN
        },
        payumoney_key: {
          type: Sequelize.STRING(100)
        },
        payumoney_salt: {
          type: Sequelize.STRING(100)
        },
        payumoney_demo: {
          type: Sequelize.BOOLEAN
        },
        payu_extra_charge: {
          type: Sequelize.DECIMAL(10,2)
        },
        payumoney_status: {
          type: Sequelize.BOOLEAN
        },
        ccavenue_key: {
          type: Sequelize.STRING(100)
        },
        ccavenue_salt: {
          type: Sequelize.STRING(100)
        },
        ccavenue_demo: {
          type: Sequelize.BOOLEAN
        },
        ccavenue_extra_charge: {
          type: Sequelize.DECIMAL(10,2)
        },
        ccavenue_status: {
          type: Sequelize.BOOLEAN
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
          type: Sequelize.BOOLEAN
        },
        paytm_extra_charge: {
          type: Sequelize.DECIMAL(10,2)
        },
        paytm_status: {
          type: Sequelize.BOOLEAN
        },
        stack_secret_key: {
          type: Sequelize.STRING(120)
        },
        stack_public_key: {
          type: Sequelize.STRING(120)
        },
        stack_demo: {
          type: Sequelize.BOOLEAN
        },
        stack_extra_charge: {
          type: Sequelize.DECIMAL(3,2)
        },
        stack_status: {
          type: Sequelize.BOOLEAN
        },
        status: {
          allowNull: false,
          type: Sequelize.BOOLEAN
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        modified_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        created_by: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        modified_by: {
          allowNull: false,
          type: Sequelize.INTEGER
        }
      },
      {
          engine: 'InnoDB',
          charset: 'utf8mb4',
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('payment_settings');
  }
};
