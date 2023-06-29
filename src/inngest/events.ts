import createActions from './events/create-actions'
import generate from './events/generate'
import schedule from './events/schedule'
import failure from './events/failure'
import cancel from './events/cancel'
import reminder from './events/reminder'
import confirmationEmail from './events/confirmation-email'

export const ingestEvents = [
  createActions,
  generate,
  schedule,
  failure,
  confirmationEmail,
  reminder,
  cancel
]
