try {
  const filesRoot = 'chrome-extension://mnceojblkdhadkikjpllbmbhmcffacik'
  const player = document.querySelector('#vplayer')
  const overlayPlayer = document.querySelector('#ru-fragment-overlay-player')
  overlayPlayer.style.display = 'none'

  const fragmentsMap = Object.entries(window.ruFragmentsMap)
  let isOverlayActive = false
  player.addEventListener('timeupdate', () => {
    for(const [fragment, time] of fragmentsMap) {
      if(player.currentTime >= time[0] && player.currentTime <= time[1]) {
        if(isOverlayActive) return
        
        isOverlayActive = true
        overlayPlayer.src = `${filesRoot}/media/video/ru_fragment_${fragment}.mp4`
        if(!player.paused) {
          overlayPlayer.play()
        }
        overlayPlayer.style.display = 'block'
        return
      }
    }

    if(isOverlayActive) {
      isOverlayActive = false
      overlayPlayer.pause()
      overlayPlayer.currentTime = 0
      overlayPlayer.removeAttribute('src')
      overlayPlayer.style.display = 'none'
    }
  })

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