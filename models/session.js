const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Session extends Model {}

Session.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  tableName: '_sessions_',
  modelName: 'session'
})

module.exports = Session