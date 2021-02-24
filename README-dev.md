## tampermonkey 文档（参照用）
https://www.tampermonkey.net/documentation.php

## 如何获取字幕
https://www.skillshare.com/transcripts/f12ad438-8d83-49fc-84d1-d985319f9920/text.vtt
可以直接拿到 VTT 格式的内容。页面里有变量可以拿到这个地址
```javascript
	var vjs = videojs(document.querySelector('video'))
	var url = vjs.mediainfo.text_tracks[0].src
```

肉眼看这个 VTT 似乎没问题。

```vtt
WEBVTT
X-TIMESTAMP-MAP=LOCAL:00:00:00.000,MPEGTS:0

00:00:00.000 --> 00:00:07.490
All right,

00:00:07.490 --> 00:00:09.460
So let's say we've heard back to the client.

00:00:09.460 --> 00:00:10.320
They loved him all,

00:00:10.320 --> 00:00:12.820
but they wanted to see a little bit of color added.
```

但如果扔到 validator 会报错
错误1：第二行 `X-TIMESTAMP-MAP=LOCAL:00:00:00.000,MPEGTS:0` 不行
错误2：有某些行的开始时间和结束时间一致
总之直接保存这个 vtt 帮助不大，最好改成 SRT 再保存。

## 拿 videojs
```javascript
	var vjs = videojs(document.querySelector('video'))
	console.log(vjs)
```


## 输出某个元素有哪些监听器
```javascript
	getEventListeners(document)
```
document 是 HTML 元素

## 杂
// First created at 2020-2-24
// 仅下载 Skillshare 字幕
// 1. 这个脚本对页面里的变量有强依赖（废话）如果哪天 Skillshare 改动了一些变量的名字或者路径，这个脚本就可能失效。
// 2. 测试环境:
// https://www.skillshare.com/classes/Logo-Design-Mastery-The-Full-Course/1793713747/transcripts
// 注意，页面后面一定要带 transcripts，否则就拿不到数据。
// window.SS.serverBootstrap.pageData.sectionData.transcriptCuesArray 有数据

// 比如这样
// https://www.skillshare.com/classes/Logo-Design-Mastery-The-Full-Course/1793713747/projects
// 是不行的。
// window.SS.serverBootstrap.pageData.sectionData.transcriptCuesArray 没数据
// 如果在这样的页面，点击 Transcribe tab 会发一个请求
// https://www.skillshare.com/classes/Logo-Design-Mastery-The-Full-Course/1793713747/transcripts?format=json
