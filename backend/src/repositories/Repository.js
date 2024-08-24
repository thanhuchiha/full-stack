class Repository {
    constructor(model) {
        this.model = model;
    }

    /**
     *
     * @param {Number} id
     * @param {Object} include
     * @param {Object} attributes
     */
    async getById(id, { having = {}, include = [], attributes = {}, paranoid = true } = {}) {
        try {
            const model = await this.model.findOne({
                where: { id },
                having,
                include,
                attributes,
                paranoid
            });

            return model;
        } catch (e) {
            throw e;
        }
    }

    /**
     *
     * @param {String} email
     * @param {Object} include
     * @param {Object} attributes
     */
    async getByEmail(email, { having = {}, include = [], attributes = {}, paranoid = true } = {}) {
        try {
            const model = await this.model.findOne({
                where: { email },
                having,
                include,
                attributes,
                paranoid
            });

            return model;
        } catch (e) {
            throw e;
        }
    }

    /**
     *
     * @param {Object} condition object to find
     * @param {Object} include
     * @param {Object} attributes
     */
    async getOne(condition = {}, { having = {}, include = [], attributes = {}, paranoid = true, order = null } = {}) {
        try {
            const model = await this.model.findOne({
                where: condition,
                having,
                include,
                attributes,
                paranoid,
                order
            });

            return model;
        } catch (e) {
            throw e;
        }
    }

    /**
     *
     * @param {Number} page
     * @param {Number} limit
     * @param {Object} condition
     * @param {Object[]} include
     * @param {Object[]} order
     */
    paginate({ page = 1, limit = 10, condition = {}, include = [], attributes = {}, order = null, distinct = false, paranoid = true }) {
        /** Option to query */
        const options = {
            order,
            where: condition,
            include,
            distinct,
            paranoid
            // logging: console.log,
        };

        if (attributes) {
            options.attributes = attributes;
        }

        if (limit && page) {
            options.limit = limit;
            options.offset = (page - 1) * limit;
        }

        return this.model.findAndCountAll(options);
    }

    /**
     *
     * @param {Number} page
     * @param {Number} limit
     * @param {Object} condition
     * @param {Object[]} include
     * @param {Object[]} order
     */
    findAll(
        {
            page = 1,
            limit = 10,
            condition = {},
            include = [],
            attributes = {},
            order = null,
            distinct = false,
            paranoid = true,
            group = [],
            raw = false
        } = {},
        subQuery = false
    ) {
        /** Option to query */
        const options = {
            order,
            where: condition,
            include,
            distinct,
            paranoid,
            group,
            raw,
            subQuery
            // logging: console.log,
        };

        if (attributes) {
            options.attributes = attributes;
        }

        if (limit && page) {
            options.limit = limit;
            options.offset = (page - 1) * limit;
        }

        return this.model.findAll(options);
    }

    /**
     *
     * @param {Object} condition
     * @param {Object[]} include
     * @param {Object[]} order
     */
    getAll({
        condition = {},
        having = {},
        include = [],
        group = [],
        attributes = {},
        order = null,
        limit = null,
        distinct = false,
        paranoid = true
    } = {}) {
        /** Option to query */
        const options = {
            order,
            where: condition,
            having,
            include,
            distinct,
            paranoid
        };

        if (group.length > 0) {
            options.group = group;
        }

        if (attributes) {
            options.attributes = attributes;
        }

        if (+limit) {
            options.limit = +limit;
        }

        return this.model.findAll(options);
    }

    /**
     *
     * @param {Number} id
     * @param {Object} attributes
     */
    async updateById(id, attributes = {}, transaction = null) {
        try {
            let foundModel = await this.model.findOne({ where: { id }, paranoid: false });

            // Check model exist
            if (foundModel) {
                foundModel = await foundModel.update(attributes, { transaction });
            }

            return foundModel;
        } catch (e) {
            throw e;
        }
    }

    /**
     *
     * @param {Object} attributes attributes to be updated
     * @param {Object} condition Condition to find
     */
    async updateOne(condition = {}, attributes = {}, transaction = null) {
        try {
            let foundModel = await this.model.findOne({ where: condition });

            // Check model exist
            if (foundModel) {
                foundModel = await foundModel.update(attributes, { transaction });
            }

            return foundModel;
        } catch (e) {
            throw e;
        }
    }

    /**
     *
     * @param {Object} condition Condition to find
     * @param {Object} attributes attributes to be updated
     */
    async update(condition = {}, attributes = {}, transaction = null) {
        try {
            await this.model.update(attributes, { where: condition, transaction });
            const foundModels = await this.model.findAll({ where: condition });

            return foundModels;
        } catch (e) {
            throw e;
        }
    }

    /**
     *
     * @param {Number} id
     */
    async deleteById(id, transaction = null) {
        return await this.model.destroy({
            where: {
                id
            },
            transaction
        });
    }

    /**
     *
     * @param {Object} condition
     */
    async delete(condition = {}, transaction = null) {
        return await this.model.destroy({ where: condition, transaction });
    }

    /**
     *
     * @param {Number} id
     */
    async destroyById(id, transaction = null) {
        return await this.model.destroy({
            where: {
                id
            },
            transaction,
            force: true
        });
    }

    /**
     *
     * @param {Object} condition
     */
    async destroy(condition = {}, transaction = null) {
        return await this.model.destroy({ where: condition, transaction, force: true });
    }

    /**
     *
     * @param {Object} attributes
     */
    async create(attributes = {}, transaction = null) {
        try {
            const model = await this.model.create(attributes, { transaction });
            return model;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    /**
     *
     * @param {Array} arr
     */
    async bulkCreate(arr, transaction = null, include = []) {
        try {
            if (arr.length) {
                return await this.model.bulkCreate(arr, { include, transaction });
            }
        } catch (e) {
            throw e;
        }
    }

    /**
     *
     * @param {Array} arr
     */
    async bulkUpdate(arr, attributes = [], transaction = null) {
        try {
            if (arr.length && attributes.length) {
                return await this.model.bulkCreate(arr, { updateOnDuplicate: attributes, transaction });
            }
        } catch (e) {
            throw e;
        }
    }

    /**
     *
     * @param {Object} condition object to count
     * @param {Object} include
     * @param {Object} attributes
     */
    async count(condition = {}, paranoid = false) {
        try {
            const model = await this.model.count({
                where: condition,
                paranoid
                // distinct: true,
            });

            return model;
        } catch (e) {
            throw e;
        }
    }
}

export { Repository };
