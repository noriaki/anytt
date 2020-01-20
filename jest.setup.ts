import { resolve } from 'path';
import dotenv from 'dotenv';
import 'jest-enzyme';

dotenv.config({ path: resolve('./.env.test') });
