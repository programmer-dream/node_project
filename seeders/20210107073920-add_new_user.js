'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.sequelize.query(
      "INSERT INTO `users` (`auth_vls_id`, `user_name`, `password`, `school_id`, `branch_vls_id`, `role_id`, `user_vls_id`, `old_passwords`, `password_criteria`, `user_settings_vls_id`, `recovery_email_id`, `password_reset_type`, `recovery_contact_no`, `autentication_type`, `last_login`, `vls_session_id`, `erp_session_id`, `session_expiry`, `created_at`, `updated_at`, `forget_pwd_token`, `forget_pwd_otp`, `name`, `photo`, `status`) VALUES(1, 1608289989168, '$2a$08$HATyfPw5kcJRsJ41F.jfZOBJBnQxTpsY8gNToB.wfVBrPFbQc7IlS', NULL, NULL, 1, NULL, '[\"$2a$08$LXBdcFwHEM6asjdSp7/70eDPElb11kEq6JNigiDB0AEoo9XIV7yHG\",\"$2a$08$4XC/n3vnDbe1qw0oGF4XPOUkK3y0bm58gAxLMJGO9HGlmM/fbVpce\",\"$2a$08$HATyfPw5kcJRsJ41F.jfZOBJBnQxTpsY8gNToB.wfVBrPFbQc7IlS\"]', NULL, NULL, 'manpreet1461@gmail.com', 'PasswordResetLink', '+917009561996', NULL, NULL, NULL, NULL, NULL, '2020-12-18 11:13:09', '2020-12-30 11:23:35', 'eTn55xFRMLfDNOpI5ojAkvQB4X2jPC1609327415887', NULL, '', NULL, NULL),(2, 1608289989170, '$2a$08$CuSQPbVVgzWhey9c90O/d.KImu7jkA2R.92SFe85UhlOfxq3CV1KS', 1, 1, 4, 1, '[\"$2a$08$5ndi5nwqISKRbttdqeHARejldM7ZaQKbbcMFw1X996/TkHzYppX0C\",\"$2a$08$XnM816CrqL4mtIbNJr2q5O7h9BI86mL7emzGj5Qxae3VlxZ0C.4my\",\"$2a$08$CuSQPbVVgzWhey9c90O/d.KImu7jkA2R.92SFe85UhlOfxq3CV1KS\"]', NULL, NULL, 'manpreet1461@gmail.com', 'PasswordResetLink', '+917009561996', NULL, NULL, NULL, NULL, NULL, '2020-12-22 00:00:00', '2020-12-30 11:25:42', '9FGcTTU0qRKEyRMrU75XnP2dvu7W6N1609327542776', NULL, 'Deepak Mehra', NULL, NULL),(3, 1608289989172, '$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi', 1, 1, 5, 3, '[\"$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi\"]', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-12-22 00:00:00', '2020-12-22 00:00:00', NULL, NULL, '', NULL, NULL),(4, 1608289989174, '$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi', 1, 1, 3, 1, '[\"$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi\"]', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-12-22 00:00:00', '2020-12-22 00:00:00', NULL, NULL, '', NULL, NULL),(5, 1608289989176, '$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi', 1, 1, 5, 1, '[\"$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi\"]', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-12-22 00:00:00', '2020-12-22 00:00:00', NULL, NULL, '', NULL, NULL),(6, 1608289989178, '$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi', 1, 1, 4, 1, '[\"$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi\"]', NULL, NULL, 'vikas.zestgeek@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-12-23 00:00:00', '2020-12-23 00:00:00', NULL, NULL, '', NULL, NULL),(7, 1608289989180, '$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi', 1, 1, 2, 9, '[\"$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi\"]', NULL, 1, 'admin@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2021-01-07 00:00:00', '2021-01-07 00:00:00', NULL, NULL, '', NULL, NULL),(8, 1608289989182, '$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi', 1, 1, 1, 7, '[\"$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi\"]', NULL, 1, 'super@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2021-01-07 00:00:00', '2021-01-07 00:00:00', NULL, NULL, '', NULL, NULL),(9, 1608289989184, '$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi', 1, 1, 2, 6, '[\"$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi\"]', NULL, 1, 'admin@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2021-01-07 00:00:00', '2021-01-07 00:00:00', NULL, NULL, '', NULL, NULL),(10, 1608289989186, '$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi', 1, 1, 14, 5, '[\"$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi\"]', NULL, 1, 'admin@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2021-01-07 00:00:00', '2021-01-07 00:00:00', NULL, NULL, '', NULL, NULL),(11, 1608289989188, '$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi', 1, 1, 4, 1, '[\"$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi\"]', NULL, 1, 'admin@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2021-01-07 00:00:00', '2021-01-07 00:00:00', NULL, NULL, '', NULL, NULL),(12, 1608289989190, '$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi', 1, 1, 5, 4, '[\"$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi\"]', NULL, 1, 'admin@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2021-01-07 00:00:00', '2021-01-07 00:00:00', NULL, NULL, '', NULL, NULL),(13, 1608289989192, '$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi', 1, 1, 3, 1, '[\"$2a$08$WOjd8dqnu1yUDQrLJe1AxOJTc.YQkZPu3TBW.Z/Bi8vF5cVVu6gGi\"]', NULL, 1, 'admin@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2021-01-07 00:00:00', '2021-01-07 00:00:00', NULL, NULL, '', NULL, NULL)"
    );
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('users', null, {});
  }
};