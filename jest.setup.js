import * as dotenv from 'dotenv';
// require('jest-fetch-mock').enableMocks()
dotenv.config({ path: './.env.development.local' });
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.setImmediate = jest.useRealTimers;