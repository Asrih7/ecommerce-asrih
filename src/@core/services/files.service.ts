import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FilesService {
  constructor() { }

  convertImageToBase64(url: string, callback: { (base64Data: any): void }) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = function () {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx!.drawImage(img, 0, 0);
      var base64Data = canvas.toDataURL('image/png');
      callback(base64Data);
    };
  }

  getFileNameFromPath(path: string) {
    const url = new URL(path);
    const pathname = url.pathname;
    const pathSegments = pathname.split('/');
    return pathSegments[pathSegments.length - 1];
  }

  dataURLtoFile(dataurl: any, filename: any) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let bsLength = bstr.length; //base64 string length
    const u8arr = new Uint8Array(bsLength);

    while (bsLength--) {
      u8arr[bsLength] = bstr.charCodeAt(bsLength);
    }

    return new File([u8arr], filename, { type: mime });
  }
}
