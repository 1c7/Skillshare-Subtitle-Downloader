// 调试的时候打了一些注释，都放到这里来。用处可能不大，就存着

// SS.EventTracker.classDetails()

// https://edge.api.brightcove.com/playback/v1/accounts/3695997568001/videos/6045459871001
// "videoId":"bc:6045459871001" bc 是什么意思？

// "brightcoveAccountId":3695997568001
// brightcove是什么？

// [
//   {
//     "error_code": "INVALID_POLICY_KEY",
//     "message": "Request policy key is missing or invalid"
//   }
// ]

// Accept: application/json;pk=BCpkADawqM2OOcM6njnM7hf9EaK6lIFlqiXB0iWjqGWUQjU7R8965xUvIQNqdQbnDTLz0IAO7E6Ir2rIbXJtFdzrGtitoee0n1XXRliD-RH9A-svuvNW9qgo3Bh34HEZjXjG4Nml4iyz3KqF
// BCpkADawqM2OOcM6njnM7hf9EaK6lIFlqiXB0iWjqGWUQjU7R8965xUvIQNqdQbnDTLz0IAO7E6Ir2rIbXJtFdzrGtitoee0n1XXRliD-RH9A-svuvNW9qgo3Bh34HEZjXjG4Nml4iyz3KqF


// 除了 videos/后面的参数不一样，pk=是一样的
// https://edge.api.brightcove.com/playback/v1/accounts/3695997568001/videos/6045465114001
// Accept: application/json;pk=BCpkADawqM2OOcM6njnM7hf9EaK6lIFlqiXB0iWjqGWUQjU7R8965xUvIQNqdQbnDTLz0IAO7E6Ir2rIbXJtFdzrGtitoee0n1XXRliD-RH9A-svuvNW9qgo3Bh34HEZjXjG4Nml4iyz3KqF

// Policy-Key-Raw 这一串拿不到。

// setSession
// loadSessionVideo
// onVideoPlaylistPlaybackStateChange
// https://static.skillshare.com/assets/js/build/pages-newClasses.369700e13a5b79e89ffa.build.min.js

//   <h3 class="session-item-title" data-rank="41">
//   <span class="session-item-title-rank">41.</span> Exporting Your Files
// </h3>

// loadVideo

// document.querySelector('video')
// vjs.textTracks_.tracks_[0].src 可以拿到 vtt 的 URL

// var vjs = videojs(document.querySelector('video'))
// vjs.textTracks()[0].cues // 拿当前的字幕似乎没问题, 可以直接  loop
// vjs.textTracks()[0].cues[0].endTime

// mediainfo.text_tracks[0].src 这样也可以，用 mediainfo


// document.querySelector('title').nextSibling.nextElementSibling
// document.querySelector('title').nextElementSibling
// eval(document.querySelector('title').nextElementSibling.innerText);

// var current_video_id = SS.serverBootstrap.classData.sku
// console.log(current_video_id);
// 1793713747
// 有没有办法根据这个 id, 找到当前这一集的标题？找到这一集的字幕。

// var current = SS.serverBootstrap.pageData.videoPlayerData;
// console.log(current);
// 不行
// 6045459870001

// 有一个全局变量叫 SS
// console.log("SS的数据是")
// console.log(window.SS);
// var transcriptCuesArray = window.SS.serverBootstrap.pageData.sectionData.transcriptCuesArray;
// // transcriptCuesArray 不是100%有的。
// if (transcriptCuesArray == undefined) {
//   console.log('没有.');
//   return;
// }
// 
// console.log(transcriptCuesArray)
// console.log(subtitle_ids)
// 
// // var subtitle_array = Object.values(transcriptCuesArray); // []
// 