import createActions from './events/create-actions'
import generate from './events/generate'
import schedule from './events/schedule'
import failure from './events/failure'
import reply from './events/reply'
import collab from './events/collab'
import cancel from './events/cancel'
import followup from './events/followup'

export const ingestEvents = [
  createActions,
  generate,
  schedule,
  failure,
  reply,
  collab,
  followup,
  cancel
]
