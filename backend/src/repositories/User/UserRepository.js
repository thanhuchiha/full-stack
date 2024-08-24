import { User } from "../../models/schema/User";
import { Repository } from "../Repository";

class UserRepository extends Repository {
  constructor() {
    super(User);
  }

  /**
   *
   * @param {Number} id
   * @param {Object} include
   * @param {Object} attributes
   */
  async getById(
    id,
    {
      exclude = [],
      having = {},
      include = [],
      attributes = {},
      paranoid = true,
    } = {}
  ) {
    try {
      const finalAttributes = { ...attributes, exclude };

      const model = await this.model.findOne({
        where: { id },
        having,
        include,
        attributes: finalAttributes,
        paranoid,
      });

      return model;
    } catch (e) {
      throw e;
    }
  }
}

export { UserRepository };
