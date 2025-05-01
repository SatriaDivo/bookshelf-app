// models/book.js
const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Book = sequelize.define('Book', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: uuidv4, // use uuid as the default value
    },
    title: {
      type: DataTypes.STRING,
    },
    author: {
      type: DataTypes.STRING,
    },
    year: {
      type: DataTypes.INTEGER,
    },
    isComplete: {
      type: DataTypes.BOOLEAN,
    },
  });

  return Book;
};
