const ws = new WebSocket('ws://192.168.1.121:10109')

window.console.log = (...args) => {
  ws.send(JSON.stringify(args))
}

window.console.warn = (...args) => {
  ws.send(JSON.stringify(args))
}

window.console.error = (...args) => {
  ws.send(JSON.stringify(args))
}

ws.addEventListener('message', (event) => {
  const result = eval(event.data)
  ws.send(JSON.stringify(result))
})

window.addEventListener('error', (msg, url, line, col, error) => {
  ws.send(JSON.stringify({ msg, url, line, col, error }))
})

ws.addEventListener('open', () => {
  ws.send('Connected from ' + document.querySelector('title').innerText)
})