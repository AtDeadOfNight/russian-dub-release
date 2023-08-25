import { spawn } from 'child_process'


export const getMP4Length = (filename: string) => {
  return new Promise<number>(resolve => {  
    const ffprobe = spawn('ffprobe', [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      filename
    ])

    let output = ''

    ffprobe.stdout.on('data', (data) => {
      output += data.toString()
    })

    ffprobe.on('close', (code) => {
      if (code !== 0) {
        throw new Error(`ffprobe exited with code ${code}`)
        return
      }
      const durationInSeconds = parseFloat(output.trim())
      resolve(durationInSeconds)
    })

    ffprobe.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`)
    })
  })
}