import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { getMP4Length } from './get-mp4-length.js'
import fs from 'fs/promises'

const fragments = ``.split('\n')

const isExists = async (filename: string) => {
  try {
    await fs.stat(filename)
    return true
  } catch(e) {
    return false
  }
}

let overallSeconds = 0

const __dirname = dirname(fileURLToPath(import.meta.url)) + '/../'
const baseDir = __dirname + '../../../en_original/media/audio/'
for(const fragment of fragments) {
  let seconds
  if(await isExists(baseDir + fragment)) {
    seconds = await getMP4Length(baseDir + fragment)
  } else {
    seconds = await getMP4Length(baseDir + 'EVP/' + fragment)
  }
  overallSeconds += seconds
  console.log(fragment, seconds, overallSeconds)
}


console.log('Result:', overallSeconds)