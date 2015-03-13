/**
 * Created by Adrian on 3/10/15.
 */

module app.plugins {
    export interface QueueLoaderItem {
        id: string;
        type: string;
        path: string;
    }

    interface QueueLoaderFile {
        id: string;
        XHR: XMLHttpRequest;
    }

    export class QueueLoader {
        private _requests: QueueLoaderFile[];
        private _progress: number;
        private _length:   number;

        constructor () {
            this._progress = 0;
            this._requests = [];
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


        // PRIVATE
        // -------

        private setRequest (file: QueueLoaderItem): void {
            // Validations
            if (!QueueLoader.validType(file.type) && typeof console !== 'undefined' && console.warn) {
                console.warn('"' + file.id + '" has unrecognized type: ' + file.type);

                // If validations fail abort!.
                return;
            }

            // Push request.
            this._requests.push({
                id:  file.id,
                XHR: this.XHR(file.path)
            });
        }

        private XHR (URL: string): XMLHttpRequest {
            var XHR: XMLHttpRequest = new XMLHttpRequest();
            var cache: any = { progress: 0 };

            XHR.open('GET', URL, true);

            XHR.responseType = 'blob';
            XHR.onprogress   = this.XHR_onprogress.bind(this, cache);
            XHR.onload       = this.XHR_onload.bind(this);

            return XHR;
        }

        private XHR_onprogress (cache: any, e: ProgressEvent): void {
            var progress: number = e.loaded / e.total;
            var queueBit: number = (progress - cache.progress) / this._length;

            this._progress = this._progress + queueBit;
            cache.progress = progress;
        }

        private XHR_onload (e: Event): void {
            var currentTarget = <XMLHttpRequest>e.currentTarget;

            if (currentTarget.status === 200) {
                var URL = QueueLoader.URL.createObjectURL(currentTarget.response);
                console.log(URL);
            }
        }

        // UTILITIES
        // ---------

        private static URL = <URL>(function () {
            return window['URL'] || window['webkitURL'];
        })();

        private static validType (type): boolean {
            return (type === 'IMAGE' || type === 'VIDEO' || type === 'AUDIO');
        }
    }

}
