'use strict';

const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const salt = bcrypt.genSaltSync();
    return User.bulkCreate([{
      username: 'user1',
      password: bcrypt.hashSync('123456', salt),
      email: 'user1@user.com',
    }, {
      username: 'user2',
      password: bcrypt.hashSync('123456', salt),
      email: 'user2@user.com',
    }, {
      username: 'user3',
      password: bcrypt.hashSync('123456', salt),
      email: 'user3@user.com',
    }, {
      username: 'user4',
      password: bcrypt.hashSync('123456', salt),
      email: 'user4@user.com',
    }, {
      username: 'admin1',
      password: bcrypt.hashSync('123456', salt),
      email: 'admin1@user.com',
    }]);
  },

  down: queryInterface => queryInterface.bulkDelete('Users', null, {}),
};
