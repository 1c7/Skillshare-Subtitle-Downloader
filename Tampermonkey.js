// ==UserScript==
// @name:zh-CN   Skillshare 字幕下载 v7
// @name         Skillshare Subtitle Downloader v7
// @namespace    https://greasyfork.org/users/5711
// @version      7
// @description:zh-CN  下载 Skillshare 的字幕文件 (.srt 文件)
// @description  Download Skillshare Subtitle as .srt file
// @author       Zheng Cheng
// @match        https://www.skillshare.com/classes/*
// @run-at       document-end
// @grant        unsafeWindow
// ==/UserScript==

// 写于 2020-2-24
// [工作原理]
// 1. 下载一门课程全部字幕（多个 .srt 文件）原理是利用 transcriptCuesArray，字幕数据都在里面，进行格式转换+保存即可
// 2. 下载当前视频的字幕（一个 .srt 文件）原理是用 videojs 里 textTracks 的 cue，进行格式转换+保存即可

// [更新日志]
// v7（2021-3-11）: 可以下载视频，包括当前视频，以及从当前视频开始一直到最后一个视频。

(function () {
  'use strict';

  // 【配置项】
  // 如果想 "从当前视频开始，一直下载到最后一个视频"
  // 请填入 POLICY_KEY
  const POLICY_KEY = null

  // 举例:
  // const POLICY_KEY = 'BCpkADawqM2OOcM6njnM7hf9EaK6lIFlqiXB0iWjqGWUQjU7R8965xUvIQNqdQbnDTLz0IAO7E6Ir2rIbXJtFdzrGtitoee0n1XXRliD-RH9A-svuvNW9qgo3Bh34HEZjXjG4Nml4iyz3KqF'
  
  // 说明
  // policy_key 仅用于下载全部视频, 其他功能不需要
  // 只能从一个获取视频数据的 http 请求里的请求头/响应头拿到。应该是代码构建的，页面里没法搜索到。
  // 就只能这样写死了。

  // 初始化一些必须的变量
  var sessions = null;
  var transcriptCuesArray = null;
  var div = document.createElement('div');
  var button = document.createElement('button'); // 下载全部字幕的按钮
  var button2 = document.createElement('button'); // 下载当前视频字幕的按钮
  var button3 = document.createElement('button'); // 下载当前视频的按钮
  var button4 = document.createElement('button'); // 下载全部视频的按钮
  var title_element = document.querySelector("div.class-details-header-title");

  function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  // 注入
  async function inject_our_script() {
    transcriptCuesArray = await get_transcriptCuesArray();
    var subtitle_ids = Object.keys(transcriptCuesArray); // ['3150718', '3150719', '3150720', ...]
    var subtitle_count = subtitle_ids.length

    // 此按钮点击后：下载这门课的所有字幕 (得到多个文件)
    var button_text = `下载所有字幕 (${subtitle_count} 个 .srt 文件)`;
    button.textContent = button_text;
    button.addEventListener('click', download_subtitles);

    // 此按钮点击后：下载当前视频的一个字幕 (得到一个文件)
    button2.textContent = get_download_current_episode_button_text()
    button2.addEventListener('click', download_current_episode_subtitles);

    // 此按钮点击后：下载当前视频
    button3.textContent = get_download_current_video_button_text()
    button3.addEventListener('click', download_current_episode_video);

    var button_css = `
      font-size: 16px;
      padding: 4px 18px;
    `;

    var button2_css = `
      font-size: 16px;
      padding: 4px 18px;
      margin-left: 10px;
    `;

    var div_css = `
      margin-bottom: 10px;
    `;

    button.setAttribute('style', button_css);
    button2.setAttribute('style', button2_css);
    button3.setAttribute('style', button2_css);
    div.setAttribute('style', div_css);

    div.appendChild(button);
    div.appendChild(button2);
    div.appendChild(button3);

    if (POLICY_KEY != null) {
      button4.textContent = "从当前视频开始, 下载到最后一个视频"
      button4.addEventListener('click', download_all_video);
      button4.setAttribute('style', button2_css);
      div.appendChild(button4);
    }

    insertAfter(div, title_element);
  }

  // 下载当前这一集的视频
  function download_current_episode_video() {
    var vjs = videojs(document.querySelector('video'))
    var video_link = null;
    var video_type = null;

    // 在数组里找到 *.mp4 的链接
    var video_link = find_video_link(vjs.mediainfo.sources)

    if (video_link != null) {
      var filename = `${get_filename()}.mp4`
      fetch(video_link)
        .then(res => res.blob())
        .then(blob => {
          downloadString(blob, 'video/mp4', filename);
        });
    }
  }

  function download_video(video_link, filetype, filename) {
    return new Promise((resolve, reject) => {
      fetch(video_link)
        .then(res => res.blob())
        .then(blob => {
          downloadString(blob, filetype, filename);
          resolve(true);
        }).catch(err => reject(err));
    })
  }

  // 输入: sources 数组, 来自于网络请求的返回
  // 输出: (字符串) 一个视频链接
  function find_video_link(sources) {
    var video_link = null;

    // 在数组里找到 *.mp4 的链接
    var array = sources;
    for (var i = 0; i < array.length; i++) {
      var s = array[i];
      if (s.container && s.container == 'MP4' && s.height >= 720) {
        video_link = s.src;
        break;
      }
    }
    return video_link
  }

  // 把 cue 遍历一下，得到一个特定格式的对象数组
  function get_current_episode_content_array() {
    var vjs = videojs(document.querySelector('video'))
    var cues = vjs.textTracks()[0].cues
    var array = []
    for (var i = 0; i < cues.length; i++) {
      var cue = cues[i]
      var obj = {
        start: cue.startTime,
        end: cue.endTime,
        text: cue.text,
      }
      array.push(obj);
    }
    return array;
  }

  // 下载当前集字幕
  async function download_current_episode_subtitles() {
    var array = get_current_episode_content_array()
    var srt = parse_content_array_to_SRT(array);
    var filename = `${get_filename()}.srt`
    downloadString(srt, "text/plain", filename);
  }

  // CSRF
  function csrf() {
    return SS.serverBootstrap.parentClassData.formData.csrfTokenValue
  }

  // 拿到当前课程的 URL (不带任何参数或者 section，不带 /projects 或 /transcripts 在 URL 最后)
  function course_url() {
    var url1 = SS.serverBootstrap.loginPopupRedirectTo
    var url2 = window.location.origin + window.location.pathname
    if (url1) {
      return url1
    } else {
      return url2
    }
    // return document.querySelector('meta[property="og:url"]').content // 这个不可靠
    // 比如: 
    // https://www.skillshare.com/classes/Logo-Design-Mastery-The-Full-Course/1793713747
  }

  // 返回一个 URL
  function json_url() {
    return `${course_url()}/transcripts?format=json`
    // https://www.skillshare.com/classes/Logo-Design-Mastery-The-Full-Course/1793713747/transcripts?format=json
  }

  // 发 http 请求，拿到 transcriptCuesArray
  // 调用例子：var result = await get_transcriptCuesArray();
  async function get_transcriptCuesArray() {
    return new Promise(function (resolve, reject) {
      var url = json_url()
      fetch(url, {
          headers: {
            'x-csrftoken': csrf(),
            'accept': 'application/json, text/javascript, */*; q=0.01'
          }
        })
        .then(response => response.json())
        .then(data => {
          resolve(data.transcriptCuesArray)
        }).catch(e => {
          reject(e);
        })
    })
  }

  // 输入: id
  // 输出: sessions 数组里的一个对象
  function id_to_obj(id) {
    var array = sessions
    for (var i = 0; i < array.length; i++) {
      var one = array[i];
      if (one.id == id) {
        return one
      }
    }
    return null
  }

  // 输入: id
  // 输出: 文件名 (xxx.srt)
  function get_filename_by_id(id) {
    var obj = id_to_obj(id);
    var rank = obj.displayRank;
    var title = obj.title
    var filename = `${rank}.${safe_filename(title)}.srt`
    return filename
  }

  // 下载所有集的字幕
  async function download_subtitles() {
    sessions = unsafeWindow.SS.serverBootstrap.pageData.unitsData.units[0].sessions

    for (let key in transcriptCuesArray) {
      var value = transcriptCuesArray[key];
      var srt = parse_content_array_to_SRT(value.content);
      var filename = get_filename_by_id(key)
      downloadString(srt, "text/plain", filename);

      await sleep(1000);
      // 如果不 sleep，下载大概11个文件就会停下来（不会报错，但就是停下来了）
      // sleep 可以把全部42个文件下载下来
    }
  }

  // 下载全部视频
  async function download_all_video() {
    // 发请求给
    // https://edge.api.brightcove.com/playback/v1/accounts/3695997568001/videos/6234379709001
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

    // 假设从当前视频开始下载
    var startingSession = unsafeWindow.SS.serverBootstrap.pageData.videoPlayerData.startingSession
    var sessions = unsafeWindow.SS.serverBootstrap.pageData.videoPlayerData.units[0].sessions
    for (var i = 0; i < sessions.length; i++) {
      var session = sessions[i];
      var displayRank = session.displayRank;
      if (displayRank >= startingSession.displayRank) {
        var video_id = session.videoId.split(':')[1]; // 视频 ID
        var response = await get_single_video_data(video_id); // 拿到 JSON 返回

        var video_link = find_video_link(response.sources); // 视频链接
        var rank = session.displayRank // 视频编号
        var filename = `${rank}. ${safe_filename(response.name)}.mp4`; // 文件名
        if (video_link.startsWith('http://')) {
          video_link = video_link.replace('http://', 'https://')
        }
        console.log(video_link);
        console.log(filename);
        await download_video(video_link, 'video/mp4', filename); // 下载
      }
    }
  }

  // 返回账户 ID
  // 举例: 3695997568001
  function get_account_id() {
    return unsafeWindow.SS.serverBootstrap.pageData.videoPlayerData.brightcoveAccountId;
  }

  // 输入: id
  // 输出: JSON (视频数据)
  function get_single_video_data(video_id) {
    // https://edge.api.brightcove.com/playback/v1/accounts/3695997568001/videos/6234379709001
    var account_id = get_account_id();
    var url = `https://edge.api.brightcove.com/playback/v1/accounts/${account_id}/videos/${video_id}`
    return new Promise(function (resolve, reject) {
      fetch(url, {
          headers: {
            // 'x-csrftoken': csrf(),
            // 'accept': 'application/json, text/javascript, */*; q=0.01'
            "Accept": `application/json;pk=${POLICY_KEY}`
            // Policy-Key-Raw: BCpkADawqM2OOcM6njnM7hf9EaK6lIFlqiXB0iWjqGWUQjU7R8965xUvIQNqdQbnDTLz0IAO7E6Ir2rIbXJtFdzrGtitoee0n1XXRliD-RH9A-svuvNW9qgo3Bh34HEZjXjG4Nml4iyz3KqF
          }
        })
        .then(response => response.json())
        .then(data => {
          resolve(data)
        }).catch(e => {
          reject(e);
        })
    })
  }

  // 把指定格式的数组
  // 转成 SRT
  // 返回字符串
  // var content_array_example = [
  //   {
  //     start: 0,
  //     end: 8.3,
  //     text: "hi"
  //   },
  //   // ...
  // ];
  function parse_content_array_to_SRT(content_array) {
    if (content_array === '') {
      return false;
    }

    var result = '';
    var BOM = '\uFEFF';
    result = BOM + result; // store final SRT result

    for (var i = 0; i < content_array.length; i++) {
      var one = content_array[i];
      var index = i + 1;
      var content = one.text
      var start = one.start
      var end = one.end

      // we want SRT format:
      /*
          1
          00:00:01,939 --> 00:00:04,350
          everybody Craig Adams here I'm a
          2
          00:00:04,350 --> 00:00:06,720
          filmmaker on YouTube who's digging
      */
      var new_line = "\n";
      result = result + index + new_line;
      // 1

      var start_time = process_time(parseFloat(start));
      var end_time = process_time(parseFloat(end));
      result = result + start_time;
      result = result + ' --> ';
      result = result + end_time + new_line;
      // 00:00:01,939 --> 00:00:04,350

      result = result + content + new_line + new_line;
    }
    return result;
  }


  // 处理时间. 比如 start="671.33"  start="37.64"  start="12" start="23.029"
  // 处理成 srt 时间, 比如 00:00:00,090    00:00:08,460    00:10:29,350
  function process_time(s) {
    s = s.toFixed(3);
    // 超棒的函数, 不论是整数还是小数都给弄成3位小数形式
    // 举个柚子:
    // 671.33 -> 671.330
    // 671 -> 671.000
    // 注意函数会四舍五入. 具体读文档

    var array = s.split('.');
    // 把开始时间根据句号分割
    // 671.330 会分割成数组: [671, 330]

    var Hour = 0;
    var Minute = 0;
    var Second = array[0]; // 671
    var MilliSecond = array[1]; // 330
    // 先声明下变量, 待会把这几个拼好就行了

    // 我们来处理秒数.  把"分钟"和"小时"除出来
    if (Second >= 60) {
      Minute = Math.floor(Second / 60);
      Second = Second - Minute * 60;
      // 把 秒 拆成 分钟和秒, 比如121秒, 拆成2分钟1秒

      Hour = Math.floor(Minute / 60);
      Minute = Minute - Hour * 60;
      // 把 分钟 拆成 小时和分钟, 比如700分钟, 拆成11小时40分钟
    }
    // 分钟，如果位数不够两位就变成两位，下面两个if语句的作用也是一样。
    if (Minute < 10) {
      Minute = '0' + Minute;
    }
    // 小时
    if (Hour < 10) {
      Hour = '0' + Hour;
    }
    // 秒
    if (Second < 10) {
      Second = '0' + Second;
    }
    return Hour + ':' + Minute + ':' + Second + ',' + MilliSecond;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // copy from: https://gist.github.com/danallison/3ec9d5314788b337b682
  // Example downloadString(srt, "text/plain", filename);
  function downloadString(text, fileType, fileName) {
    var blob = new Blob([text], {
      type: fileType
    });
    var a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
    }, 11500);
  }

  // 切换了视频会触发这个事件
  // 实测好像点其他地方也会触发这个事件，
  document.addEventListener("selectionchange", function () {
    button2.textContent = get_download_current_episode_button_text()
  })

  function get_download_current_episode_button_text() {
    return `下载当前字幕 (.srt)`
    // return `下载当前字幕 (${get_filename()}.srt)`
  }

  function get_download_current_video_button_text() {
    return `下载当前视频 (.mp4)`
  }

  // 返回当前正在播放的视频标题
  function get_current_title() {
    var li = document.querySelector('li.session-item.active')
    var title = li.querySelector('.session-item-title')
    return title.innerText;
  }

  // 转换成安全的文件名
  function safe_filename(string) {
    return string.replace(':', '-')
  }

  // 当前视频的安全文件名
  function get_filename() {
    return safe_filename(get_current_title())
  }

  // 程序入口
  function main() {
    // 如果有标题才执行
    title_element = document.querySelector("div.class-details-header-title");
    if (title_element) {
      inject_our_script();
    }
  }

  setTimeout(main, 2000);
})();