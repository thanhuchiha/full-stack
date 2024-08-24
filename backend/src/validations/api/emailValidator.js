import { Validator } from '../validator';
import commoneRule from './commonRule';

export default [commoneRule.email('email'), Validator.check()];
