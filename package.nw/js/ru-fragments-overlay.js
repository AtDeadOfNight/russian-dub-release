// The purpose of this file is to overlay the video player with fragments of russian text at specific timestamps
setTimeout(() => {
  try {
    const filesRoot = 'chrome-extension://mnceojblkdhadkikjpllbmbhmcffacik'
    const debugMenu = document.querySelector('#debug-menu')
    const player = document.querySelector('#vplayer')
    const overlayPlayer = document.querySelector('#ru-fragment-overlay-player')
    overlayPlayer.style.display = 'none'

    const fragmentsMap = Object.entries(window.ruFragmentsMap.timestamps)
    let activeOverlay = false

    let interval = null
    const startFrequentUpdates = (startTime) => {
      interval = setInterval(() => {
        const relativeTime = player.currentTime - startTime
        
        if(relativeTime < 0) return

        if(Math.abs(overlayPlayer.currentTime - relativeTime) > 0.1) {
          console.log('Corrected overlay player time from', overlayPlayer.currentTime, 'to', relativeTime, 'retreived from vplayertime')
          overlayPlayer.currentTime = relativeTime
        }
      }, 10)
    }

    console.log('Started up ru-fragments overlay')

    const resetOverlay = () => {
      activeOverlay = false
      clearInterval(interval)
      overlayPlayer.pause()
      overlayPlayer.currentTime = 0
      overlayPlayer.removeAttribute('src')
      overlayPlayer.style.display = 'none'
    }

    const onTimeUpdate = () => {
      for(const [fragment, time] of fragmentsMap) {
        const fragmentPriority = window.ruFragmentsMap.priorities[fragment]
        const offset = window.ruFragmentsMap.offsets[fragment] || 0
        const startTime = time[0] + offset
        const endTime = time[1] + offset
        if(player.currentTime >= startTime && player.currentTime <= endTime) {
          if(activeOverlay === fragment) return
          const activeOverlayPriority = activeOverlay === false ? -1 : window.ruFragmentsMap.priorities[activeOverlay]
          if(activeOverlay !== false && activeOverlayPriority >= fragmentPriority) {
            return
          }
          
          activeOverlay = fragment
          overlayPlayer.src = `${filesRoot}/media/video/ru_fragment_${fragment}.mp4`
          if(!player.paused) {
            overlayPlayer.currentTime = player.currentTime - time[0]
            overlayPlayer.play()
          }
          overlayPlayer.style.display = 'block'

          if(interval !== null) clearInterval(interval)
          startFrequentUpdates(time[0])

          return
        } else if(activeOverlay === fragment) {
          resetOverlay()
        }
      }

      if(activeOverlay !== false) {
        resetOverlay()
      }
    }

    setInterval(() => {
      debugMenu.innerText = `playerCurrentTime: ${player.currentTime}\nisOverlayActive: ${activeOverlay !== false}`
    }, 10)
    
    player.addEventListener('timeupdate', onTimeUpdate)

    player.addEventListener('pause', () => {
      if(activeOverlay !== false) {
        overlayPlayer.pause()
      }
    })

    player.addEventListener('play', () => {
      if(activeOverlay !== false) {
        overlayPlayer.play()
      }
    })
  } catch(e) {
    console.error(e)
  }
}, 3000)

setInterval(() => {
  const player = document.querySelector('#vplayer')
  const overlayPlayer = document.querySelector('#ru-fragment-overlay-player')

  const wn = Number(overlayPlayer.style?.width.slice(0, -2))
  const hn = Number(overlayPlayer.style?.height.slice(0, -2))
  const wnn = player.offsetWidth
  const hnn = player.offsetHeight
  if(wn !== wnn || hn !== hnn) {
    overlayPlayer.style.width = wnn + 'px'
    overlayPlayer.style.height = hnn + 'px'
    console.log(`Adjusted overlay player to ${wnn}x${hnn}`)
  }
}, 2000)