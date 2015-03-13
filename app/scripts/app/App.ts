/**
 * Created by Adrian on 3/10/15.
 */

module app {
    export class App {

        constructor () {
            this
                .igniteDependencies();
        }

        private igniteDependencies () {
            App.queue = new plugins.QueueLoader();

            App.queue.add(
                { id: 'video_1',  type: 'VIDEO', path: './videos/video_1'  + App.videoExtension },
                { id: 'video_2',  type: 'VIDEO', path: './videos/video_2'  + App.videoExtension },
                { id: 'video_3',  type: 'VIDEO', path: './videos/video_3'  + App.videoExtension },
                { id: 'video_4',  type: 'VIDEO', path: './videos/video_4'  + App.videoExtension },
                { id: 'video_5',  type: 'VIDEO', path: './videos/video_5'  + App.videoExtension },
                { id: 'video_6',  type: 'VIDEO', path: './videos/video_6'  + App.videoExtension },
                { id: 'video_7',  type: 'VIDEO', path: './videos/video_7'  + App.videoExtension },
                { id: 'video_8',  type: 'VIDEO', path: './videos/video_8'  + App.videoExtension },
                { id: 'video_9',  type: 'VIDEO', path: './videos/video_9'  + App.videoExtension },
                { id: 'video_10', type: 'VIDEO', path: './videos/video_10' + App.videoExtension },
                { id: 'video_11', type: 'VIDEO', path: './videos/video_11' + App.videoExtension },
                { id: 'video_12', type: 'VIDEO', path: './videos/video_12' + App.videoExtension },
                { id: 'video_13', type: 'VIDEO', path: './videos/video_13' + App.videoExtension }
            );

            App.queue.load();
        }


        // APP UTILITIES
        // -------------

        // H.264 video support.
        static canPlayH264 = <boolean>(function () {
            var video = <HTMLVideoElement>document.createElement('video');
            return !!(video.canPlayType && video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"').replace(/no/, ''));
        })();

        // webm video support.
        static canPlayWEBM = <boolean>(function () {
            var video = <HTMLVideoElement>document.createElement('video');
            return !!(video.canPlayType && video.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/no/, ''));
        })();

        // Preferred video extension.
        static videoExtension = <string>(function () {
            if (App.canPlayH264) return '.mp4';
            if (App.canPlayWEBM) return '.webm';
        })();


        // APP DEPENDENCIES
        // ----------------

        static queue: plugins.QueueLoader;
    }
}
