// 这个文件只是为了证明，直接从 Skillshare 上面拿 VTT 然后保存下来是行不通的
var vjs = videojs(document.querySelector('video'))
var url = vjs.mediainfo.text_tracks[0].src
// https://www.skillshare.com/transcripts/f12ad438-8d83-49fc-84d1-d985319f9920/text.vtt
// 访问这个 URL 得到的内容参照同目录下的 1.vtt 文件

fetch(url)
  .then(response => response.text())
  .then(data => {
    // console.log(data);
    var parser = new WebVTT.Parser(window, WebVTT.StringDecoder())
    parser.parse(data);
    parser.flush();
    parser.oncue = function (cue) {
      console.log(cue);
    };
    parser.onflush = function () {
      console.log("Flushed");
    };
  });
// parser 会报错。