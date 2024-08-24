module.exports = {
    up: async (queryInterface, Sequelize) =>
        queryInterface.createTable(
            'users',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                uid: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                email: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                password: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                name: {
                    type: Sequelize.STRING,
                },
                phone: {
                    type: Sequelize.STRING,
                },
                address: {
                    type: Sequelize.STRING,
                },
                active: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                deleted_at: {
                    type: Sequelize.DATE,
                    defaultValue: null
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.fn('NOW')
                },
                updated_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.fn('NOW')
                }
            },
            {
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        ),

    down: async queryInterface => queryInterface.dropTable('users')
};
