'use strict';

const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);

const User = require("./user");
// const UserInfo = require("./userinfo");

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;
db.User = User;
// db.UserInfo = UserInfo;

User.init(sequelize); 
// UserInfo.init(sequelize);

User.associate(db);
// UserInfo.associate(db);

module.exports = db;
