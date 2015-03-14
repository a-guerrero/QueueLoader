/**
 * Created by Adrian on 3/10/15.
 */

module app.plugins {
    export interface QueueLoaderItem {
        id:   string;
        type: string;
        path: string;
    }

    interface QueueLoaderFile extends QueueLoaderItem {
        XHR?:      XMLHttpRequest;
        progress?: number;
        result?:   HTMLElement;
    }

    export class QueueLoader {
        private _requests:       QueueLoaderFile[];
        private _progress:       number;
        private _requestsLoaded: number;
        private _length:         number;

        constructor () {
            this._requests       = [];
            this._progress       = 0;
            this._requestsLoaded = 0;
        }

        // PUBLIC API
        // ----------

        public add (...files: QueueLoaderItem[]) {
            files.forEach(this.setRequest.bind(this));
        }

        public load () {
            this._length = this._requests.length;

            this._requests.forEach((file: QueueLoaderFile) => {
                file.XHR.send();
            });
        }

        public getResult (id: string): HTMLElement {
            var i;

            for (i = 0; i < this._length; i++) {
                if (this._requests[i].id === id) {
                    return this._requests[i].result;
                }
            }

            return null;
        }

        public onComplete: Function;


        // PRIVATE
        // -------

        private setRequest (file: QueueLoaderItem): void {
            var request: QueueLoaderFile;

            // Validations
            if (!QueueLoader.validType(file.type) && typeof console !== 'undefined' && console.warn) {
                console.warn('"' + file.id + '" has unrecognized type: ' + file.type);

                // If validations fail abort!.
                return;
            }

            request = { id: file.id, path: file.path, type: file.type };
            request.progress = 0;
            request.XHR      = this.XHR(request);

            // Push request.
            this._requests.push(request);
        }

        private XHR (file: QueueLoaderFile): XMLHttpRequest {
            var XHR: XMLHttpRequest = new XMLHttpRequest();
            XHR.open('GET', file.path, true);

            XHR.responseType = 'blob';
            XHR.onprogress   = this.XHR_onprogress.bind(this, file);
            XHR.onload       = this.XHR_onload.bind(this, file);

            return XHR;
        }

        private XHR_onprogress (file: QueueLoaderFile, e: ProgressEvent): void {
            var progress: number = e.loaded / e.total;
            var queueBit: number = (progress - file.progress) / this._length;

            this._progress = this._progress + queueBit;
            file.progress = progress;

            //console.log(this._progress);
        }

        private XHR_onload (file: QueueLoaderFile, e: Event): void {
            var currentTarget = <XMLHttpRequest>e.currentTarget;
            var URL: string, type: string;

            if (currentTarget.status === 200) {
                URL  = QueueLoader.URL.createObjectURL(currentTarget.response);
                type = currentTarget.response.type;

                file.result = QueueLoader.getVideo(URL, type);

                ++this._requestsLoaded;

                if (this._requestsLoaded === this._length && typeof this.onComplete === 'function') {
                    this.onComplete();
                }
            }
        }


        // UTILITIES
        // ---------

        private static URL = window['URL'] || window['webkitURL'];

        private static validType (type): boolean {
            return (type === 'IMAGE' || type === 'VIDEO' || type === 'AUDIO');
        }

        private static getVideo (src: string, type: string): HTMLElement {
            var video  = <HTMLVideoElement>document.createElement('video');
            var source = <HTMLSourceElement>document.createElement('source');

            source.src  =  src;
            source.type = type;

            video.appendChild(source);
            return video;
        }
    }

}
