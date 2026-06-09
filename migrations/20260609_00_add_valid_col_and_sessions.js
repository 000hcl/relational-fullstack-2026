const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'disabled', {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    })
    await queryInterface.createTable('_sessions_', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'disabled')
    await queryInterface.dropTable('_sessions_')
  }
}