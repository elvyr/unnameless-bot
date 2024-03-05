import fetch from 'node-fetch'
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper'

let limit = 100

let handler = async (m, { conn, args, isPrems, isOwner }) => {
  	if (!args || !args[0]) throw '_Input URL!_'
  	if (!args[0].match(/youtu/gi)) throw `_This isn't a youtube link!_`
	m.react('🎧')
	let chat = global.db.data.chats[m.chat]
	const isY = /y(es)/gi.test(args[1])
	const { thumbnail, audio: _audio, title } = await youtubedl(args[0]).catch(async _ => await youtubedlv2(args[0]))
	const limitedSize = (isPrems || isOwner ? 2000 : limit) * 1024
	let audio, source, res, link, lastError, isLimit
	for (let i in _audio) {
		try {
			audio = _audio[i]
			if (isNaN(audio.fileSize)) continue
			isLimit = limitedSize < audio.fileSize
			if (isLimit) continue
			link = await audio.download()
			if (link) res = await fetch(link)
			isLimit = res?.headers.get('content-length') && parseInt(res.headers.get('content-length')) < limitedSize
			if (isLimit) continue
			if (res) source = await res.arrayBuffer()
			if (source instanceof ArrayBuffer) break
		} catch (e) {
			audio = link = source = null
			lastError = e
		}
	}
	if ((!(source instanceof ArrayBuffer) || !link || !res.ok) && !isLimit) throw 'ERROR: ' + (lastError || 'Can\'t download audio')
	if (!isY && !isLimit) await conn.sendFile(m.chat, thumbnail, 'thumbnail.jpg', `[ Youtube MP3 ]\n\n• Title: ${title}\n• Size: ${audio.fileSizeH}\n• ${isLimit ? 'Using ' : ''}Link: ${link}`, m)
	if (!isLimit) await conn.sendFile(m.chat, source, title + '.mp3', `[ Youtube MP3 ]\n\n• Title: ${title}\n• Size: ${audio.fileSizeH}`, m)
}

handler.help = ['yta <url>']
handler.tags = ['downloader']
handler.command = /^yt(a|mp3)$/i

handler.register = false

export default handler