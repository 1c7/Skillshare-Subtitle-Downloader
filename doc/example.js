	// 发请求给
	// https://edge.api.brightcove.com/playback/v1/accounts/3695997568001/videos/6234379709001

	// 这是一个样例返回
	// var example_return = {
	//   "poster": "https://cf-images.us-east-1.prod.boltdns.net/v1/jit/3695997568001/8d273617-b8f1-42ea-98a6-d36139552e2f/main/1280x720/5m3s296ms/match/image.jpg",
	//   "thumbnail": "https://cf-images.us-east-1.prod.boltdns.net/v1/jit/3695997568001/8d273617-b8f1-42ea-98a6-d36139552e2f/main/160x90/5m3s296ms/match/image.jpg",
	//   "poster_sources": [{
	//     "src": "https://cf-images.us-east-1.prod.boltdns.net/v1/jit/3695997568001/8d273617-b8f1-42ea-98a6-d36139552e2f/main/1280x720/5m3s296ms/match/image.jpg"
	//   }],
	//   "thumbnail_sources": [{
	//     "src": "https://cf-images.us-east-1.prod.boltdns.net/v1/jit/3695997568001/8d273617-b8f1-42ea-98a6-d36139552e2f/main/160x90/5m3s296ms/match/image.jpg"
	//   }],
	//   "description": null,
	//   "tags": [],
	//   "cue_points": [],
	//   "custom_fields": {},
	//   "account_id": "3695997568001",
	//   "sources": [{
	//     "codecs": "avc1,mp4a",
	//     "ext_x_version": "3",
	//     "src": "http://manifest.prod.boltdns.net/manifest/v1/hls/v3/clear/3695997568001/8d273617-b8f1-42ea-98a6-d36139552e2f/10s/master.m3u8?fastly_token=NjA0YTJmODlfNDM1MjYyMjJmY2QzMWJmZTkzNTg3MWU1MmFjMTAwOGU2ODQwNjBhMjNiYWY5YmFiYWJmNjk0YzA2ZGRjZTQ5ZA%3D%3D",
	//     "type": "application/x-mpegURL"
	//   }, {
	//     "codecs": "avc1,mp4a",
	//     "ext_x_version": "3",
	//     "src": "https://manifest.prod.boltdns.net/manifest/v1/hls/v3/clear/3695997568001/8d273617-b8f1-42ea-98a6-d36139552e2f/10s/master.m3u8?fastly_token=NjA0YTJmODlfNDM1MjYyMjJmY2QzMWJmZTkzNTg3MWU1MmFjMTAwOGU2ODQwNjBhMjNiYWY5YmFiYWJmNjk0YzA2ZGRjZTQ5ZA%3D%3D",
	//     "type": "application/x-mpegURL"
	//   }, {
	//     "codecs": "avc1,mp4a",
	//     "ext_x_version": "4",
	//     "src": "http://manifest.prod.boltdns.net/manifest/v1/hls/v4/clear/3695997568001/8d273617-b8f1-42ea-98a6-d36139552e2f/10s/master.m3u8?fastly_token=NjA0YTJmODlfYTcyZDI3Njg5MjhjZTRhY2I1ZjFkOWM5YjU4OGQzZjg5ZjhkZjI3YWNmODI5MDg5YTRiZDMyYjRmMGZkYWY3OQ%3D%3D",
	//     "type": "application/x-mpegURL"
	//   }, {
	//     "codecs": "avc1,mp4a",
	//     "ext_x_version": "4",
	//     "src": "https://manifest.prod.boltdns.net/manifest/v1/hls/v4/clear/3695997568001/8d273617-b8f1-42ea-98a6-d36139552e2f/10s/master.m3u8?fastly_token=NjA0YTJmODlfYTcyZDI3Njg5MjhjZTRhY2I1ZjFkOWM5YjU4OGQzZjg5ZjhkZjI3YWNmODI5MDg5YTRiZDMyYjRmMGZkYWY3OQ%3D%3D",
	//     "type": "application/x-mpegURL"
	//   }, {
	//     "codecs": "avc1,mp4a",
	//     "profiles": "urn:mpeg:dash:profile:isoff-live:2011",
	//     "src": "http://manifest.prod.boltdns.net/manifest/v1/dash/live-baseurl/clear/3695997568001/8d273617-b8f1-42ea-98a6-d36139552e2f/6s/manifest.mpd?fastly_token=NjA0YTJmODlfMjViY2ZlZGM0MDczZmJlZmE2MzNhODVhYzYwM2QwODIyYTk1NGYxNDE5ZmQ4N2Q4ZDg1YjM5YTBmODNhYmE5NQ%3D%3D",
	//     "type": "application/dash+xml"
	//   }, {
	//     "codecs": "avc1,mp4a",
	//     "profiles": "urn:mpeg:dash:profile:isoff-live:2011",
	//     "src": "https://manifest.prod.boltdns.net/manifest/v1/dash/live-baseurl/clear/3695997568001/8d273617-b8f1-42ea-98a6-d36139552e2f/6s/manifest.mpd?fastly_token=NjA0YTJmODlfMjViY2ZlZGM0MDczZmJlZmE2MzNhODVhYzYwM2QwODIyYTk1NGYxNDE5ZmQ4N2Q4ZDg1YjM5YTBmODNhYmE5NQ%3D%3D",
	//     "type": "application/dash+xml"
	//   }, {
	//     "avg_bitrate": 1407000,
	//     "codec": "H264",
	//     "container": "MP4",
	//     "duration": 606592,
	//     "height": 720,
	//     "size": 107252789,
	//     "src": "http://bcbolt446c5271-a.akamaihd.net/media/v1/pmp4/static/clear/3695997568001/8d273617-b8f1-42ea-98a6-d36139552e2f/c7d34e08-b1d7-468d-91b8-c72987f80fcb/main.mp4?akamai_token=exp=1615474569~acl=/media/v1/pmp4/static/clear/3695997568001/8d273617-b8f1-42ea-98a6-d36139552e2f/c7d34e08-b1d7-468d-91b8-c72987f80fcb/main.mp4*~hmac=2aea87178e6e66183d8d4b0bfd604850cdf627218ab577693ff77d9d568324bf",
	//     "width": 1280
	//   }, {
	//     "avg_bitrate": 1407000,
	//     "codec": "H264",
	//     "container": "MP4",
	//     "duration": 606592,
	//     "height": 720,
	//     "size": 107252789,
	//     "src": "https://bcbolt446c5271-a.akamaihd.net/media/v1/pmp4/static/clear/3695997568001/8d273617-b8f1-42ea-98a6-d36139552e2f/c7d34e08-b1d7-468d-91b8-c72987f80fcb/main.mp4?akamai_token=exp=1615474569~acl=/media/v1/pmp4/static/clear/3695997568001/8d273617-b8f1-42ea-98a6-d36139552e2f/c7d34e08-b1d7-468d-91b8-c72987f80fcb/main.mp4*~hmac=2aea87178e6e66183d8d4b0bfd604850cdf627218ab577693ff77d9d568324bf",
	//     "width": 1280
	//   }],
	//   "name": "Stocks App: Generic Network Manager",
	//   "reference_id": null,
	//   "long_description": null,
	//   "duration": 606592,
	//   "economics": "AD_SUPPORTED",
	//   "text_tracks": [{
	//     "id": "c807c2f3-ae06-454c-9048-137a294fa75a",
	//     "account_id": "3695997568001",
	//     "src": "https://www.skillshare.com/transcripts/a6b235a0-0130-4651-94ba-de065673f7b2/text.vtt?ts=20210222171013",
	//     "srclang": "en",
	//     "label": "English",
	//     "kind": "captions",
	//     "mime_type": "text/vtt",
	//     "asset_id": null,
	//     "sources": [{
	//       "src": "https://www.skillshare.com/transcripts/a6b235a0-0130-4651-94ba-de065673f7b2/text.vtt?ts=20210222171013"
	//     }],
	//     "default": true
	//   }],
	//   "published_at": "2021-02-22T16:51:12.376Z",
	//   "created_at": "2021-02-22T16:51:12.362Z",
	//   "updated_at": "2021-02-22T17:10:13.636Z",
	//   "offline_enabled": false,
	//   "link": null,
	//   "id": "6234379709001",
	//   "ad_keys": null
	// }

	// https://edge.api.brightcove.com/playback/v1/accounts/3695997568001/videos/6234379709001
	// 分析一下: 3695997568001 和 6234379709001 是什么？
	// 返回的数据可以看到是 account_id: "3695997568001"，那么这个是当前账户的 id
	// 第二个 6234379709001 应该是视频的 id
	// 问：这两项数据如何获取？

	// 如何获取 account_id？
	// SS.serverBootstrap.pageData.videoPlayerData.brightcoveAccountId

	// 如何获取 video_id？
	// pageData.videoPlayerData.units[0].sessions[0].videoId
	// videoId: "bc:6234378710001"

	// 如果要下载全部视频
	// 思路：遍历 pageData.videoPlayerData.units[0].sessions
	// 里面每一个就是一个视频，然后发请求获得数据，然后下载
	// var sessions = unsafeWindow.SS.serverBootstrap.pageData.videoPlayerData.units[0].sessions
	// for (var i = 0; i < sessions.length; i++) {
	//   var session = sessions[i];
	//   var video_id = session.videoId.split(':')[1];
	//   var response = await get_single_video_data(video_id);
	//   var video_link = find_video_link(response.sources);
	//   var filename = safe_filename(response.name)
	//   await download_video(video_link, 'video/mp4', filename)
	// }