/// <reference path="../../definitions/jquery/jquery.d.ts" />


URL = window['URL'] || window['webkitURL'];


var XHR: XMLHttpRequest = new XMLHttpRequest();

XHR.open('GET', './images/182H.jpg', true);
XHR.responseType = 'blob';

XHR.onload = function () {
    if (this.status === 200) {

        console.log('XHR ONLOAD');

        var blob: Blob = this.response;
        var img = <HTMLImageElement>document.createElement('img');
        img.src = URL.createObjectURL(blob);

        img.onload = function () {
            URL.revokeObjectURL(img.src);
        };

        document.body.appendChild(img);

    }
};

XHR.send();
