import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { getMP4Length } from './get-mp4-length.js'
import fs from 'fs/promises'

const fragments = `M_O1.mp3
M_O1B.mp3
M_O2.mp3
M_O2B.mp3
M_O3.mp3
M_O3B.mp3
M_O4.mp3
M_O4B.mp3
M_O5.mp3
M_O5B.mp3
M_O6.mp3
M_O6B.mp3
M_O7.mp3
M_O7B.mp3
M_O8.mp3
M_O8B.mp3
M_O9.mp3
M_O9B.mp3
M_O10.mp3
M_O10A.mp3
M_O10B.mp3
M_O11.mp3
M_O11B.mp3
M_O12.mp3
M_O12B.mp3
M_O13.mp3
M_O13B.mp3
M_O14.mp3
M_O14B.mp3
M_O15.mp3
M_O15B.mp3
M_O16.mp3
M_O16B.mp3
M_O17.mp3
M_O17B.mp3
M_O18.mp3
M_O18B.mp3
M_O19.mp3
M_O19B.mp3
M_O20.mp3
M_O20B.mp3
M_O21.mp3
M_O21B.mp3
M_O22.mp3
M_O22B.mp3
M_O23.mp3
M_O23B.mp3
M_O24.mp3
M_O24B.mp3
M_O25.mp3
M_O25B.mp3
M_O26.mp3
M_O26B.mp3
M_O27.mp3
M_O27B.mp3
M_IN1.mp3
M_IN2.mp3
M_IN3.mp3
M_IN4.mp3
M_IN5.mp3
M_IN6.mp3
M_IN7.mp3
M_IN8.mp3
M_IN9.mp3
M_IN10.mp3
M_IN11.mp3
M_QA1.mp3
M_QA2.mp3
M_QA3.mp3
M_QH1.mp3
M_QH2.mp3
M_QH3.mp3
M_QP1.mp3
M_QP2.mp3
M_QP3.mp3
M_QR1.mp3
M_QR2.mp3
M_QR3.mp3
M_NM1.mp3
M_NM2.mp3
M_NM3.mp3
M_NM4.mp3
Call1.mp3
Call2.mp3
Call3.mp3
Call4.mp3
Call5.mp3
Go1.mp3
Go2.mp3
Go3.mp3
Go4.mp3
Go5.mp3
Go6.mp3
GuestSendStairs.mp3
GuestSendElevator.mp3
RescueA.mp3
RescueB.mp3
RescueC.mp3
RescueE.mp3
RescueF.mp3
M_A1.mp3
M_A1A.mp3
M_A1H.mp3
M_A1P.mp3
M_A1R.mp3
M_A2.mp3
M_A2A.mp3
M_A2P.mp3
M_A2R.mp3
M_A2Z.mp3
M_A3.mp3
M_A3A.mp3
M_A3H.mp3
M_A3P.mp3
M_A3R.mp3
M_A3Z.mp3
M_A4.mp3
M_A4A.mp3
M_A4H.mp3
M_A4R.mp3
M_A4Z.mp3
M_A5.mp3
M_A5A.mp3
M_A5P.mp3
M_A5Z.mp3
M_A6.mp3
M_A6A.mp3
M_A6H.mp3
M_A6P.mp3
M_A6Z.mp3
M_A7.mp3
M_A7A.mp3
M_A7H.mp3
M_A7P.mp3
M_A7R.mp3
M_A7Z.mp3
M_H0.mp3
M_H0H.mp3
M_H0R.mp3
M_H0Z.mp3
M_H1.mp3
M_H1H.mp3
M_H1R.mp3
M_H1P.mp3
M_H2.mp3
M_H2H.mp3
M_H2P.mp3
M_H2R.mp3
M_H2Z.mp3
M_H3.mp3
M_H3H.mp3
M_H3R.mp3
M_H3Z.mp3
M_H4.mp3
M_H4H.mp3
M_H4P.mp3
M_H4R.mp3
M_H4Z.mp3
M_H5.mp3
M_H5H.mp3
M_H5R.mp3
M_H5Z.mp3
M_H6.mp3
M_H6H.mp3
M_H6Z.mp3
M_H7.mp3
M_H7H.mp3
M_H7R.mp3
M_H7Z.mp3
M_H8.mp3
M_H8H.mp3
M_H8P.mp3
M_H8R.mp3
M_H8Z.mp3
M_H9.mp3
M_H9H.mp3
M_H9Z.mp3
M_P1.mp3
M_P1H.mp3
M_P1P.mp3
M_P1R.mp3
M_P2.mp3
M_P2H.mp3
M_P2P.mp3
M_P2R.mp3
M_P2Z.mp3
M_P3.mp3
M_P3H.mp3
M_P3P.mp3
M_P3R.mp3
M_P3Z.mp3
M_P4.mp3
M_P4H.mp3
M_P4P.mp3
M_P4R.mp3
M_P4Z.mp3
M_P5.mp3
M_P5P.mp3
M_P5R.mp3
M_P5Z.mp3
M_P6.mp3
M_P6H.mp3
M_P6P.mp3
M_P6R.mp3
M_P6Z.mp3
M_P7.mp3
M_P7P.mp3
M_P7R.mp3
M_P7Z.mp3
M_P8.mp3
M_P8H.mp3
M_P8P.mp3
M_P8R.mp3
M_P8Z.mp3
M_P9.mp3
M_P9H.mp3
M_P9P.mp3
M_P9R.mp3
M_P9Z.mp3
M_R1.mp3
M_R1H.mp3
M_R1R.mp3
M_R2.mp3
M_R2H.mp3
M_R2R.mp3
M_R2Z.mp3
M_R3.mp3
M_R3R.mp3
M_R3Z.mp3
M_R4.mp3
M_R4R.mp3
M_R4Z.mp3
M_R5.mp3
M_R5H.mp3
M_R5R.mp3
M_R5Z.mp3
M_R6.mp3
M_R6R.mp3
M_R6Z.mp3
M_R7.mp3
M_R7R.mp3
M_R7Z.mp3
M_R8.mp3
M_R8H.mp3
M_R8P.mp3
M_R8R.mp3
M_R8Z.mp3
M_R9.mp3
M_R9R.mp3
M_R9Z.mp3
M_V1.mp3
M_V1H.mp3
M_V1R.mp3
M_V2.mp3
M_V2R.mp3
M_V3.mp3
M_V3R.mp3`.split('\n')

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