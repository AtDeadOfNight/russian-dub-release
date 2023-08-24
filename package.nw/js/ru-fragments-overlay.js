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
          // console.log('Corrected overlay player time from', overlayPlayer.currentTime, 'to', relativeTime, 'retreived from vplayertime')
          overlayPlayer.currentTime = relativeTime
        }
      }, 10)
    }

    console.log('Started up ru-fragments overlay')

    const onTimeUpdate = () => {
      debugMenu.innerText = `playerCurrentTime: ${player.currentTime}\nisOverlayActive: ${activeOverlay !== false}`
      for(const [fragment, time] of fragmentsMap) {
        const fragmentPriority = window.ruFragmentsMap.priorities[fragment]
        if(player.currentTime >= time[0] && player.currentTime <= time[1]) {
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
        }
      }

      if(activeOverlay !== false) {
        activeOverlay = false
        clearInterval(interval)
        overlayPlayer.pause()
        overlayPlayer.currentTime = 0
        overlayPlayer.removeAttribute('src')
        overlayPlayer.style.display = 'none'
      }
    }
    
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