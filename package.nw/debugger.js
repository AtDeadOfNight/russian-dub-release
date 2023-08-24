const ws = new WebSocket('ws://192.168.1.121:10109')

const log = (...args) => {
  ws.send(
    args.map(arg => {
      if(typeof arg === 'object') return JSON.stringify(arg)
      else return arg
    }).join(' ')
  )
}

window.console.log = log
window.console.warn = log
window.console.error = log

ws.addEventListener('message', (event) => {
  try {
    const result = eval(event.data)
    ws.send(JSON.stringify(result))
  } catch(err) {
    ws.send(JSON.stringify(err, Object.getOwnPropertyNames(err)))
  }
})

window.addEventListener('error', (msg, url, line, col, error) => {
  ws.send(JSON.stringify({ 
    msg: JSON.stringify(msg), 
    url: JSON.stringify(url), 
    line: JSON.stringify(line), 
    col: JSON.stringify(col),
    error: JSON.stringify(err, Object.getOwnPropertyNames(err))
  }))
})

ws.addEventListener('open', () => {
  ws.send('Connected from ' + document.querySelector('title').innerText + '!')
})

window.addEventListener('keydown', event => {
  if(event.key === 'F2') {
    document.querySelector('#debug-menu').style.display = 'block'
  }
})