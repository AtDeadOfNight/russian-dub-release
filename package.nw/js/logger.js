// The purpose of this file is to log every error that occurs in the game
// It MUST be loaded BEFORE anything else on the page

// print errors, console.error, console.warn and console.log messages like this:
// 1. create a div with the class 'log-entry' and append to the body (one time)
// 2. create a div with the class 'log-entry-message' (on each message)
// 3. append the message to the container 
// 4. set the timeout to remove the message after 5 seconds

const logContainer = document.createElement('div')
logContainer.className = 'log-container'
document.body.appendChild(logContainer)

const printMessage = (text, color) => {
  const message = document.createElement('div')
  message.textContent = text
  message.style.color = color
  logContainer.appendChild(message)
  setTimeout(() => {
    message.remove()
  }, 10 * 1000)
}

window.onerror = (message, source, lineno, colno) => {
  printMessage(`Error: ${message} at ${source}:${lineno}:${colno}`, 'red')
}

console.error = (message) => {
  printMessage(`${message}`, 'red')
}

console.warn = (message) => {
  printMessage(`${message}`, 'orange')
}

console.log = (message) => {
  printMessage(`${message}`, 'white')
}

console.log('Logger loaded inside of ' + window.location.href)