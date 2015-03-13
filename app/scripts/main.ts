/// <reference path="../../definitions/jquery/jquery.d.ts" />
/// <reference path="./app/App.ts" />

$(function () {
    new app.App();
});


URL = window['URL'] || window['webkitURL'];

function canPlayH264 () {
    var v = document.createElement('video');
    return !!(v.canPlayType && v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"').replace(/no/, ''));
}

function canPlayWebm () {
    var v = document.createElement('video');
    return !!(v.canPlayType && v.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/no/, ''));
}

var XHR: XMLHttpRequest = new XMLHttpRequest();

XHR.open('GET', './videos/sport.mp4', true);
XHR.responseType = 'blob';

XHR.onload = function () {
    if (this.status === 200) {
        var blob: Blob = this.response;

        var video = <HTMLVideoElement>document.createElement('video');
        video.src = URL.createObjectURL(blob);

        video.onloadeddata = function () {
            URL.revokeObjectURL(video.src);
            video.play();
        };

        document.body.appendChild(video);

    }
};

XHR.onprogress = function (e: ProgressEvent) {
  console.log(e.loaded / e.total);
};

// XHR.send();
