import { InngestMiddleware } from "inngest"

const loggerMiddleware = new InngestMiddleware({
  name: "logger",
  init() {
    return {
      onFunctionRun(props: any) {
        const logId = props.ctx.event.data.log_id?.slice(0, 8)
        const actionId = props.ctx.event.data.action_id?.slice(0, 8)

        if (logId) console.log(`+ ${props.fn.trigger.event} log ${logId} has started`)
        else if (actionId) console.log(`+ ${props.fn.trigger.event} action ${actionId} has started`)
        else console.log(`+ ${props.fn.trigger.event} has started`)

        return {
          afterExecution() {
            if (logId) console.log(`+ ${props.fn.trigger.event} log ${logId} has finished`)
            else if (actionId) console.log(`+ ${props.fn.trigger.event} action ${actionId} has finished`)
            else {
              console.log(`+ ${props.fn.trigger.event} has finished`)
              console.log({ data: props.ctx.event.data })
              if (props.ctx.event.data.error) {
                console.error({ error: props.ctx.event.data.error })
              }
            }
          }
        }
      }
    }
  }
})

export default loggerMiddleware