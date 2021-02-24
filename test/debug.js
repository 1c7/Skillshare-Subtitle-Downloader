// 调试的时候打了一些注释，都放到这里来。用处可能不大，就存着


// 用如下 URL 测过了，字幕都能下载
// https://www.skillshare.com/classes/Logo-Design-Mastery-The-Full-Course/1793713747
// https://www.skillshare.com/classes/The-Ultimate-Guide-to-Kinetic-Type-in-After-Effects/282677337/projects?via=logged-in-home-your-classes
// https://www.skillshare.com/classes/Words-With-Meaning-With-Olivia-Wilde/1045571583?via=logged-in-home-row-recommended-for-you&via=logged-in-home-row-recommended-for-you
// https://www.skillshare.com/classes/WordPress-eCommerce-For-Beginners/360449142?via=logged-in-home-row-teachers-followed-published&via=logged-in-home-row-teachers-followed-published
// https://www.skillshare.com/classes/Introduction-to-Cinema-4D-A-Beginners-Animation-Guide/897276610?via=browse-featured
// https://www.skillshare.com/classes/Crafting-Memoir-How-to-Outline-Your-Own-Heros-Journey/2065711375?via=browse-featured
// https://www.skillshare.com/classes/Inclusive-UX-Designing-Websites-for-Everyone/297973484?via=browse-featured
// https://www.skillshare.com/classes/Web-Development-Fundamentals-Javascript/342157332?via=browse-featured


// document.querySelector('video')
// vjs.textTracks_.tracks_[0].src 可以拿到 vtt 的 URL

// var vjs = videojs(document.querySelector('video'))
// vjs.textTracks()[0].cues // 拿当前的字幕似乎没问题, 可以直接  loop
// vjs.textTracks()[0].cues[0].endTime

// mediainfo.text_tracks[0].src 这样也可以，用 mediainfo

// var current_video_id = SS.serverBootstrap.classData.sku
// console.log(current_video_id);

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