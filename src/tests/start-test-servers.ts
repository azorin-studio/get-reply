import { spawn } from 'child_process'

export const startTestServer = async (cmd: string, opts: string[], log: boolean = true) => {
  const child = spawn(cmd, opts, { env: process.env })

  let stdout = ''
  let stderr = ''

  if (log) {
    child.stdout.on('data', (data: any) => {
      console.log(`stdout: ${data}`)
      stdout += data
    })
    child.stderr.on('data', (data: any) => {
      console.log(`stderr: ${data}`)
      stderr += data
    })
  }
  child.on('error', (error: any) => console.log(`error: ${error.message}`))

  return {
    stop: async () => {
      await new Promise(resolve => {
        child.on('close', (code: any) => {
          child.removeAllListeners()
          resolve(1)
        })
        child.pid && process.kill(child.pid, "SIGTERM")
      })
    },
    getLogs: () => ({ stdout, stderr })
  }
}
