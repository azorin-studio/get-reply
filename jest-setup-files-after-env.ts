import * as dotenv from 'dotenv'

dotenv.config({ path: './.env.local' })

import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.setImmediate = jest.useRealTimers

