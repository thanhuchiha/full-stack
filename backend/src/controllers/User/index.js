import { AuthController } from './AuthController';
import { UserController } from './UserController';

const prefix = 'user';

const controllers = [AuthController, UserController];

export { controllers, prefix };
