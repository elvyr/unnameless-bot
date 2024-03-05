import fetch from 'node-fetch'
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper'

let limit = 500

let handler = async (m, { conn, args, isPrems, isOwner }) => {
	if (!args || !args[0]) throw '_Input Query!_'
  	if (!args[0].match(/youtu/gi)) throw `_This isn't a youtube link!_`
	m.react('🎧')
  	let chat = global.db.data.chats[m.chat]
	const isY = /y(es)/gi.test(args[1])
	const { thumbnail, video: _video, title } = await youtubedl(args[0]).catch(async _ => await youtubedlv2(args[0]))
	const limitedSize = (isPrems || isOwner ? 2000 : limit) * 1024
	let video, source, res, link, lastError, isLimit
	for (let i in _video) {
    	try {
      		video = _video[i]
			if (isNaN(video.fileSize)) continue
			isLimit = limitedSize < video.fileSize
			if (isLimit) continue
			link = await video.download()
			if (link) res = await fetch(link)
			isLimit = res?.headers.get('content-length') && parseInt(res.headers.get('content-length')) < limitedSize
			if (isLimit) continue
			if (res) source = await res.arrayBuffer()
      		if (source instanceof ArrayBuffer) break
    	} catch (e) {
      		video = source = link = null
      		lastError = e
    	}
  	}
  	if ((!(source instanceof ArrayBuffer) || !link || !res.ok) && !isLimit) throw 'Error: ' + (lastError || 'Can\'t download video')
  	if (!isY && !isLimit) await conn.sendFile(m.chat, thumbnail, 'thumbnail.jpg', `[ Youtube MP4 ]\n\n• Title: ${title}\n• Filesize: ${video.fileSizeH}\n• ${isLimit ? 'Using ' : ''}Link: ${link}`, m)
  	let _thumb = {}
  	try { _thumb = { thumbnail: await (await fetch(thumbnail)).buffer() } }
  	catch (e) { }
  	if (!isLimit) await conn.sendFile(m.chat, link, title + '.mp4', `[ Youtube MP4 ]\n\n• Title: ${title}\n• Filesize: ${video.fileSizeH}`, m, false, {
    	..._thumb
  	})
}

handler.help = ['ytv <url>']
handler.tags = ['downloader']
handler.command = /^yt(v|mp4)?$/i

handler.register = false

export default handler