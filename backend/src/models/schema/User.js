let User;
const USER_STATUS = {
    ACTIVED: 1,
    NOT_ACTIVED: 0
};

const s = (builder, Sequelize) => {
    User = builder.define(
        'user',
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
                type: Sequelize.ENUM,
                values: Object.values(USER_STATUS)
            },
            deleted_at: {
                type: Sequelize.DATE
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        },
        {
            timestamps: true,
            paranoid: true,
            tableName: 'users',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at'
        }
    );
    return User;
};

export { User, s, USER_STATUS };
