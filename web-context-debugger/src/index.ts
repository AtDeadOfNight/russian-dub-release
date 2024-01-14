import Fastify from 'fastify'
import fastifyWebsocket from '@fastify/websocket'
import readline from 'readline'

const fastify = Fastify({
  logger: false
})
fastify.register(fastifyWebsocket)

function log(data) {
  readline.cursorTo(process.stdout, 0, process.stdout.rows + 1)
  process.stdout.write('↓ ' + data.replaceAll('\\n', '\n') + '\n')
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: ''
})

fastify.register(async function (fastify) {
  fastify.get('/', { websocket: true }, (connection) => {
    const sendCommand = line => {
      connection.socket.send(line.trim())
      rl.prompt()
    }

    rl.on('line', sendCommand)

    connection.socket.on('message', message => {
      log(typeof message === 'string' ? message : message.toString('utf8'))
    })

    connection.socket.on('close', () => {
      rl.off('line', sendCommand)
    })
  })
})

fastify.get('/test', (request, reply) => {
  reply.send('It works!')
})

try {
  await fastify.listen({ port: 10109, host: '0.0.0.0' })
  console.log('Listening on port 10109')
} catch (err) {
  console.error(err)
  fastify.log.error(err)
  process.exit(1)
}

rl.on('SIGINT', function() {
  fastify.close()
  rl.close()
  process.exit(0)
})

//Object.keys(window).map(k => [k, typeof window[k], typeof window[k] === 'function' ? window[k].length : (typeof window[k] === 'object' && window[k] !== null && window[k] !== undefined && !Array.isArray(window[k])) ? Object.keys(window[k]) : Array.isArray(window[k]) ? [...window[k].slice(0, 5), '+...'] : window[k]]).join(';')
//Object.fromEntries(Object.keys(window).map(k => [k, typeof window[k]]))