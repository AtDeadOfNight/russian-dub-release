import { spawn } from 'child_process'
import tmp from 'temp-dir'
import fs from 'fs/promises'
import ora from 'ora'

function findKeyFrameAfterTime(inputFile, time) {
  return new Promise(resolve => {
    let resolved = false

    const ffprobe = spawn('ffprobe', [
      '-v', 'error',
      '-select_streams', 'v',
      //	'-skip_frames', '390',
      //	'-read_intervals', '%*+600',
      '-show_entries', 'frame=pict_type,pkt_dts_time',
      '-of', 'csv=p=0',
      inputFile
    ])

    const scanChunk = (chunk) => {
      const lines = chunk.trim().split('\n')
      for (let line of lines) {
        if(resolved) break
        const [ptsTime, frameType] = line.split(',')
        if (frameType === 'I' && parseFloat(ptsTime) > time) {
          resolved = true
          ffprobe.kill()
          return resolve(ptsTime)
        }
      }
    }

    ffprobe.stdout.on('data', (data) => {
      const chunk = data.toString()
      scanChunk(chunk)
    })

    ffprobe.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`)
    })
  })
}

function findKeyFrameBeforeTime(inputFile, time) {
  return new Promise(resolve => {
    let resolved = false

    const ffprobe = spawn('ffprobe', [
      '-v', 'error',
      '-select_streams', 'v',
      //	'-skip_frames', '390',
      //	'-read_intervals', '%*+600',
      '-show_entries', 'frame=pict_type,pkt_dts_time',
      '-of', 'csv=p=0',
      inputFile
    ])

    const iFrames = []

    const scanChunk = (chunk) => {
      const lines = chunk
        .trim()
        .split('\n')
        .map(l => l.split(','))
      iFrames.push(
        ...lines.filter(([ptsTime, frameType]) => frameType === 'I' && parseFloat(ptsTime) <= time)
      )
      for (let [ptsTime] of lines) {
        if(resolved) break
        if (parseFloat(ptsTime) > time) {
          resolved = true
          ffprobe.kill()
          return resolve(iFrames.at(-1) ? iFrames.at(-1)[0] : '0')
        }
      }
    }

    ffprobe.stdout.on('data', (data) => {
      const chunk = data.toString()
      scanChunk(chunk)
    })

    ffprobe.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`)
    })
  })
}


const hotelM4VFile = '/Users/hloth/Desktop/At Dead Of Night/package.nw/media/video/Hotel.m4v'
const overlayFile = '/Users/hloth/Documents/At Dead of Night ОЗВУЧКА/ru/Video-patches/evp_receiver.mp4'
const startTime = 1*60*60 + 22*60 + 18.10 //'01:22:18.10'
const endTime = 1*60*60 + 23*60 + 46.09 //'01:23:46:09'
function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args)
    let output = ''

    child.stdout.on('data', (data) => {
      output += data
    })

    child.stderr.on('data', (data) => {
      output += data
    })

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(output))
      } else {
        resolve(output)
      }
    })
  })
}

const encodingSettings = [
  '-c:v', 'h264',
  '-b:v', '3148k'
]
async function main() {
  try {
    let spinner = ora('Поиск ключевых фреймов...').start()
    const keyframe1Time = startTime === 0 ? 0 : await findKeyFrameBeforeTime(hotelM4VFile, startTime)
    const keyframe2Time = await findKeyFrameAfterTime(hotelM4VFile, endTime)
    spinner.succeed('Найдены ключевые фреймы')

    spinner = ora('Вырезание пре-целевой части...').start()
    const patcherStartClipFilename = tmp + `/${Date.now()}_patcher-start-clip.mp4`
    await runCommand('ffmpeg', ['-i', hotelM4VFile, '-ss', '0', '-to', `${keyframe1Time}`, '-c', 'copy', '-video_track_timescale', '90k', patcherStartClipFilename])
    spinner.succeed('Вырезана пре-целевая часть')
    
    spinner = ora('Вырезание исходного целевого фрагмента...').start()
    const patcherMiddleSrcClipFilename = tmp + `/${Date.now()}_patcher-middle-src-clip.mp4`
    await runCommand('ffmpeg', ['-i', hotelM4VFile, '-to', `${keyframe2Time}`, ...encodingSettings, '-video_track_timescale', '90k', '-an', patcherMiddleSrcClipFilename])
    spinner.succeed('Вырезан исходный целевой фрагмент')
    
    spinner = ora('Наложение оверлея на целевой фрагмент...').start()
    const patcherMiddleClipFilename = tmp + `/${Date.now()}_patcher-middle-clip.mp4`
    await runCommand('ffmpeg', ['-i', patcherMiddleSrcClipFilename, '-i', overlayFile, '-filter_complex', `[0:v][1:v]overlay=enable='between(t,${startTime - keyframe1Time},(t+duration))'[vout]`, '-map', '[vout]', '-video_track_timescale', '90k', ...encodingSettings, patcherMiddleClipFilename])
    spinner.succeed('Наложен оверлей на целевой фрагмент')
    
    spinner = ora('Вырезание пост-целевой части...').start()
    const patcherEndClipFilename = tmp + `/${Date.now()}_patcher-end-clip.mp4`
    await runCommand('ffmpeg', ['-i', hotelM4VFile, '-ss', `${keyframe2Time}`, '-c', 'copy', '-video_track_timescale', '90k', patcherEndClipFilename])
    spinner.succeed('Вырезана пост-целевая часть')
    
    spinner = ora('Создание конфига...').start()
    const fileContent = `file '${patcherMiddleClipFilename}'\nfile '${patcherEndClipFilename}'`
    const patcherConcatConfigFilename = tmp + `/${Date.now()}_patcher-concat-config.txt`
    await fs.writeFile(patcherConcatConfigFilename, fileContent)
    spinner.succeed('Создан конфиг')
    
    spinner = ora('Конкатенация в итоговый файл...').start()
    await runCommand('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', patcherConcatConfigFilename, '-c', 'copy', 'output.m4v'])
    spinner.succeed('Части конкатенированы и сохранены в output.m4v')

    spinner = ora('Удаление временных файлов...').start()
    await Promise.all([
      fs.rm(patcherMiddleSrcClipFilename),
      fs.rm(patcherMiddleClipFilename),
      fs.rm(patcherEndClipFilename),
      fs.rm(patcherConcatConfigFilename)
    ])
    spinner.succeed('Удалены временные файлы')
  } catch (error) {
    console.error('Error:', error.message)
  }
}

main()