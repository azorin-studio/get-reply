import { spawn } from 'child_process'

export const startTestServer = async (cmd: string, opts: string[], log: boolean = true) => {
  const child = spawn(cmd, opts, { env: process.env })

  if (log) {
    child.stdout.on('data', (data: any) => console.log(`stdout: ${data}`))
    child.stderr.on('data', (data: any) => console.log(`stderr: ${data}`))
  }
  child.on('error', (error: any) => console.log(`error: ${error.message}`))

  return child
}

export const stopTestServer = async (server: any) => {
  await new Promise(resolve => {
    server.on('close', (code: any) => {
      server.removeAllListeners()
      resolve(1)
    })
    process.kill(server.pid, "SIGTERM")
  })

}