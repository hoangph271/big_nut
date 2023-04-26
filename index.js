const { keyboard, Key } = require('@nut-tree/nut-js')
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = require('express')()

async function initWhatsapp() {
  const client = new Client();

  client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    console.log('Client is ready!');
  });

  client.on('message', async (message) => {
    const { name } = await message.getContact()

    console.info(`message from ${name}: ${message.body}`)
  })

  client.on('media_uploaded', (message) => {
    console.info(`media_uploaded from ${message.author}:`)
    console.info(message)
  })

  client.on('message_create', async (message) => {
    const { name } = message.fromMe
      ? { name: 'You' }
      : await message.getContact()

    console.info(`${name} sent: ${message.body}`)
  })

  client.on('message_revoke_everyone', async (message, revoked_msg) => {
    const { name } = await message.getContact()

    console.info(`${name} removed: ${revoked_msg.body}`)
  })

  await client.initialize();

  process.once('beforeExit', async () => {
    await client.logout()
    console.info(`${client.info.pushname} logout...!`)
  })
}

async function nextSong() {
  await keyboard.pressKey(Key.AudioNext)
  await keyboard.releaseKey(Key.AudioNext)
}

app.get('/next', async (_, res) => {
  await nextSong()

  res.redirect('/')
})

app.get('/', (_, res) => {
  res.send(`
    <a href="/next">Next</a>
  `)
})

initWhatsapp()

// app.listen(8081, () => {
//   // console.info(`http://10.13.13.3:8081`)
// })