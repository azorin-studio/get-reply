import * as dotenv from 'dotenv'

dotenv.config({ path: './.env.local' })

import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any
global.setImmediate = jest.useRealTimers as any

