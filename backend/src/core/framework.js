import { s as UserSchema } from '../models/schema/User';

const environments = ['LCL'];

const services = {};

// Add schema
const schemas = {
    UserSchema
};

export { environments, schemas, services };
