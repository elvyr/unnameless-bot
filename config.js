import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

// Numbers
global.owner = [['6285176712310', 'Owner Bot', true]]
global.mods = [''] 
global.prems = ['']

// APIs
global.APIs = { // API Prefix
  // name: 'https://website' 
  nrtm: 'https://fg-nrtm.ddns.net',
  fgmods: 'https://api.fgmods.xyz'
}
global.APIKeys = { // APIKey Here
  // 'https://website': 'apikey'
  'https://api.fgmods.xyz': 'DRLg5kY7'
}

// Sticker WM
global.packname = 'Created by'
global.author = '@unnamed-bot\n@nameless'

// Profile
global.botName = 'UnNamed'
global.authorName = 'Nameless'
global.ignya = 'https://www.instagram.com/23710.31812' 
// global.fgsc = 'https://github.com/' 
// global.fgyt = 'https://youtube.com/'
// global.fgpyp = 'https://paypal.me/'
// global.fglog = 'https://i.ibb.co/1zdz2j3/logo.jpgs' 

// Messages
global.wait = ''
global.rwait = '⌛'
global.dmoji = '🤭'
global.done = '✅'
global.error = '❌' 
global.xmoji = '🔥' 

global.multiplier = 1
global.maxwarn = '2'

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
