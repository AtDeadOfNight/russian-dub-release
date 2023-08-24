import { spawn } from 'child_process'
import fs from 'fs/promises'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const startTimestamps: {
  [key: string]: {
    start: number,
    priority: number
  }
} = {
  'title': {
    start: 0,
    priority: 1
  },
  'evp': {
    start: 1*60*60 + 22*60 + 19 + 20/30,
    priority: 3
  },
  'basement_key': {
    start: 1*60*60 + 18*60 + 48 + 26/30,
    priority: 2
  },
  'out-of-order': {
    start: 1*60 + 10 + 2/30,
    priority: 1
  }
}

// const getMP4Length = async (filename: string) => {
//   const buff = Buffer.alloc(100)
//   const fd = await fs.open(filename, 'r')
//   const { buffer } = await fd.read(buff, 0, 100, 0)
//   const start = buffer.indexOf(Buffer.from('mvhd')) + 17
//   const timeScale = buffer.readUInt32BE(start)
//   const duration = buffer.readUInt32BE(start + 4)
//   const movieLength = Math.floor(duration / timeScale)

//   return movieLength
// }

const getMP4Length = (filename: string) => {
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

const __dirname = dirname(fileURLToPath(import.meta.url)) + '/../'
const baseDir = __dirname + '../package.nw'

const fragmentsMap = {}
for(const [fragmentName, { start }] of Object.entries(startTimestamps)) {
  const fragmentFile = baseDir + `/media/video/ru_fragment_${fragmentName}.mp4`
  fragmentsMap[fragmentName] = [start, start + await getMP4Length(fragmentFile)]
}

fs.writeFile(baseDir + '/js/ru-fragments-map.js', `window.ruFragmentsMap = ${JSON.stringify({ 
  timestamps: fragmentsMap, 
  priorities: Object.fromEntries(
    Object.entries(startTimestamps)
      .map(([fragmentName, { priority }]) => [fragmentName, priority])
  )
})}`)