import fs from 'fs/promises'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { getMP4Length } from './get-mp4-length.js'

const startTimestamps: {
  [key: string]: {
    start: number
    priority: number
    offset: number
  }
} = {
  'title': {
    start: 0,
    priority: 1,
    offset: 0
  },
  'evp': {
    start: 1*60*60 + 22*60 + 19 + 20/30,
    priority: 3,
    offset: -0.1
  },
  'basement_key': {
    start: 1*60*60 + 18*60 + 48 + 26/30,
    priority: 2,
    offset: 0
  },
  'out-of-order': {
    start: 1*60 + 9 + 26/30,
    priority: 1,
    offset: 0
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
  ),
  offsets: Object.fromEntries(
    Object.entries(startTimestamps)
      .map(([fragmentName, { offset }]) => [fragmentName, offset])
  ),
})}`)