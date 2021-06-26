require('dotenv').config();
const mongoose = require('mongoose');
const { users, posts, post_user, tags, portfolio } = require('./models');
const { mongodbConfig } = require('../config');

const mongodbUrl = process.env.MONGO_DB_URL;

mongoose.connect(mongodbUrl, mongodbConfig);

const migrate = async (callback) => {
  await users.createCollection();
  await posts.createCollection();
  await post_user.createCollection();
  await tags.createCollection();
  await portfolio.createCollection();
  await callback();
}

migrate(() => {
  mongoose.disconnect((err) => {
    if(err) return console.log(err);
    console.log('successfully migrate');
  });
})