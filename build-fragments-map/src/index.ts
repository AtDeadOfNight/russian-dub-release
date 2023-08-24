import fs from 'fs/promises'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const startTimestamps = {
  'title': 0,
  'evp': 1*60*60 + 22*60 + 19 + 20/30,
  'basement_key': 1*60*60 + 18*60 + 48 + 26/30
}

const getMP4Length = async (filename: string) => {
  const buff = Buffer.alloc(100)
  const fd = await fs.open(filename, 'r')
  const { buffer } = await fd.read(buff, 0, 100, 0)
  const start = buffer.indexOf(Buffer.from('mvhd')) + 17
  const timeScale = buffer.readUInt32BE(start)
  const duration = buffer.readUInt32BE(start + 4)
  const movieLength = Math.floor(duration / timeScale)

  return movieLength
}

const __dirname = dirname(fileURLToPath(import.meta.url)) + '/../'
const baseDir = __dirname + '../package.nw'

const fragmentsMap = {}
for(const [fragmentName, timeStart] of Object.entries(startTimestamps)) {
  const fragmentFile = baseDir + `/media/video/ru_fragment_${fragmentName}.mp4`
  fragmentsMap[fragmentName] = [timeStart, timeStart + await getMP4Length(fragmentFile)]
}

fs.writeFile(baseDir + '/js/ru-fragments-map.js', `window.ruFragmentsMap = ${JSON.stringify(fragmentsMap)}`)