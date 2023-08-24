setTimeout(() => {
  try {
    const filesRoot = 'chrome-extension://mnceojblkdhadkikjpllbmbhmcffacik'
    const player = document.querySelector('#vplayer')
    const overlayPlayer = document.querySelector('#ru-fragment-overlay-player')
    overlayPlayer.style.display = 'none'

    const fragmentsMap = Object.entries(window.ruFragmentsMap)
    let isOverlayActive = false

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
      for(const [fragment, time] of fragmentsMap) {
        if(player.currentTime >= time[0] && player.currentTime <= time[1]) {
          if(isOverlayActive) {
            return
          }
          
          isOverlayActive = true
          overlayPlayer.src = `${filesRoot}/media/video/ru_fragment_${fragment}.mp4`
          if(!player.paused) {
            overlayPlayer.currentTime = player.currentTime - time[0]
            overlayPlayer.play()
          }
          overlayPlayer.style.display = 'block'

          startFrequentUpdates(time[0])

          return
        }
      }

      if(isOverlayActive) {
        isOverlayActive = false
        clearInterval(interval)
        overlayPlayer.pause()
        overlayPlayer.currentTime = 0
        overlayPlayer.removeAttribute('src')
        overlayPlayer.style.display = 'none'
      }
    }
    
    player.addEventListener('timeupdate', onTimeUpdate)

    player.addEventListener('pause', () => {
      if(isOverlayActive) {
        overlayPlayer.pause()
      }
    })

    player.addEventListener('play', () => {
      if(isOverlayActive) {
        overlayPlayer.play()
      }
    })
  } catch(e) {
    console.error(e)
  }
}, 3000)